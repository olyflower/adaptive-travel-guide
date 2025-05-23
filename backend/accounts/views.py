from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from accounts.serializers import UserRegistrationSerializer
from accounts.services.emails import send_registration_email, send_password_reset_email, send_confirm_change_password_email
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.user
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response(status=status.HTTP_200_OK)
        response.set_cookie(
            key='access_token',
            value=str(access),
            httponly=True,
            secure=True,
            samesite='None',
            max_age=3 * 24 * 3600
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite='None',
            max_age=14 * 24 * 3600
        )
        return response


class RegisterView(CreateAPIView):
    serializer_class = UserRegistrationSerializer
    queryset = get_user_model().objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            user = self.get_queryset().get(email=response.data['email'])

            send_registration_email(request, user)

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response.data['access_token'] = str(access)
            response.data['refresh_token'] = str(refresh)

            return response
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AuthStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"isAuthenticated": True, "user": request.user.username})


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            user_model = get_user_model()

            try:
                user = user_model.objects.get(email=email)
            except user_model.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = f"{settings.FRONTEND_URL}/password-reset-confirm?uid={uid}&token={token}"

            send_password_reset_email(request, user, reset_url)

            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            uidb64 = request.data.get("uid")
            token = request.data.get("token")
            new_password = request.data.get("new_password")

            if not uidb64 or not token or not new_password:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            try:
                uid = urlsafe_base64_decode(uidb64).decode()
                user = get_user_model().objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            if not default_token_generator.check_token(user, token):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            send_confirm_change_password_email(request, user)

            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('id_token')
        if not token:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request())
            email = idinfo['email']

            user, created = get_user_model().objects.get_or_create(
                email=email,
                defaults={'username': email}
            )

            if created:
                send_registration_email(request, user)

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response = Response(status=status.HTTP_200_OK)
            response.set_cookie('access_token', str(
                access), httponly=True, secure=True, samesite='None', max_age=3 * 24 * 3600)
            response.set_cookie('refresh_token', str(
                refresh), httponly=True, secure=True, samesite='None', max_age=14 * 24 * 3600)
            return response

        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

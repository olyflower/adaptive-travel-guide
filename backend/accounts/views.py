import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.models import UserProfile
from accounts.serializers import CustomUserSerializer, UserRegistrationSerializer
from accounts.services.emails import (
    send_confirm_change_password_email,
    send_password_reset_email,
    send_registration_email,
)
from config.constants import (
    ACCESS_TOKEN_COOKIE_AGE,
    REFRESH_TOKEN_COOKIE_AGE,
)
from preferences.models import UserPreference

logger = logging.getLogger(__name__)


class CookieTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT login view that stores tokens in secure HttpOnly cookies
    Enhances security by preventing client-side script access to tokens
    """

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed:
            return Response(
                {"message": "Invalid credentials. Login failed."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = serializer.user
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response_data = {
            "message": "Success login",
            "username": user.username,
            "email": user.email,
            "access_token": str(access),
            "refresh_token": str(refresh),
        }

        response = Response(response_data, status=status.HTTP_200_OK)
        response.set_cookie(
            key="access_token",
            value=str(access),
            httponly=True,
            secure=True,
            samesite="None",
            max_age=ACCESS_TOKEN_COOKIE_AGE,
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="None",
            max_age=REFRESH_TOKEN_COOKIE_AGE,
        )
        return response


class RegisterView(CreateAPIView):
    """
    Handles new user registration, triggers welcome emails,
    and automatically issues JWT tokens upon successful sign-up
    """

    serializer_class = UserRegistrationSerializer
    queryset = get_user_model().objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            user = self.get_queryset().get(email=response.data["email"])

            send_registration_email(request, user)

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response.data["access_token"] = str(access)
            response.data["refresh_token"] = str(refresh)

            return response
        except ValidationError as e:
            return Response(
                {"message": "Validation error", "details": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.exception("Registration failed")

            return Response(
                {"message": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AuthStatusView(APIView):
    """
    Simple endpoint to check if the user is currently authenticated
    and return basic user data
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response({"isAuthenticated": True, "user": serializer.data})


class PasswordResetRequestView(APIView):
    """
    Initiates the password reset process by generating a secure token
    and sending an email with a unique reset link
    """

    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            user_model = get_user_model()

            try:
                user = user_model.objects.get(email=email)
            except user_model.DoesNotExist:
                return Response(
                    {"message": "User with this email does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = f"{settings.FRONTEND_URL}/password-reset-confirm?uid={uid}&token={token}"

            send_password_reset_email(request, user, reset_url)

            return Response(
                {"message": "Password reset email sent successfully."},
                status=status.HTTP_200_OK,
            )

        except Exception:
            logger.exception("Password reset request failed")

            return Response(
                {"message": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PasswordResetConfirmView(APIView):
    """
    Validates the reset token and updates the user's password
    after a successful verification
    """

    permission_classes = [AllowAny]

    def post(self, request):
        try:
            uidb64 = request.data.get("uid")
            token = request.data.get("token")
            new_password = request.data.get("new_password")

            if not uidb64 or not token or not new_password:
                return Response(
                    {"message": "Missing uid, token or new_password in request."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                uid = urlsafe_base64_decode(uidb64).decode()
                user = get_user_model().objects.get(pk=uid)
            except (
                TypeError,
                ValueError,
                OverflowError,
                get_user_model().DoesNotExist,
            ):
                return Response(
                    {"message": "Invalid uid."}, status=status.HTTP_400_BAD_REQUEST
                )

            if not default_token_generator.check_token(user, token):
                return Response(
                    {"message": "Invalid or expired token."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.set_password(new_password)
            user.save()

            send_confirm_change_password_email(request, user)

            return Response(
                {"message": "Password has been reset successfully."},
                status=status.HTTP_200_OK,
            )

        except Exception:
            logger.exception("Password reset confirmation failed")

            return Response(
                {"message": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LogoutView(APIView):
    """
    Logs out the user by clearing the access and refresh token cookies
    """

    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"message": "Success logout"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class GoogleLoginView(APIView):
    """
    Handles OAuth2 authentication via Google
    Verifies the ID token and creates a user record if it's their first login
    """

    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("id_token")
        if not token:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
            email = idinfo["email"]

            user, created = get_user_model().objects.get_or_create(
                email=email, defaults={"username": email}
            )

            if created:
                send_registration_email(request, user)

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response = Response(status=status.HTTP_200_OK)
            response.set_cookie(
                "access_token",
                str(access),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=ACCESS_TOKEN_COOKIE_AGE,
            )
            response.set_cookie(
                "refresh_token",
                str(refresh),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=REFRESH_TOKEN_COOKIE_AGE,
            )
            return response

        except ValueError:
            return Response(
                {"message": "Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.exception("Google login failed")
            return Response(
                {"message": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ProfileSaveFullView(APIView):
    """
    Managed combined profile data and user preferences
    Uses database transactions to ensure data integrity and
    triggers AI embedding generation for personalized recommendations
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Processes atomic updates for profile details and batch preference selections"""

        user = request.user
        data = request.data

        try:
            with transaction.atomic():
                profile, _ = UserProfile.objects.get_or_create(user=user)
                profile.nickname = data.get("nickname", profile.nickname)
                profile.age = data.get("age", profile.age)
                profile.country = data.get("country", profile.country)
                profile.avatar = data.get("avatar", profile.avatar)
                profile.gender = data.get("gender", profile.gender)
                profile.preferences_text = data.get(
                    "preferences_text", profile.preferences_text
                )
                profile.save()

                selected_option_ids = data.get("selectedOptions", [])

                UserPreference.objects.filter(user=user).delete()

                new_prefs = [
                    UserPreference(user=user, preference_option_id=opt_id)
                    for opt_id in selected_option_ids
                ]
                UserPreference.objects.bulk_create(new_prefs)

                try:
                    profile.generate_interests_vector()
                except Exception:
                    logger.exception(
                        "Failed to generate embedding for user %s",
                        user.email,
                    )

            return Response({"message": "Success"}, status=status.HTTP_200_OK)
        except Exception:
            logger.exception(
                "Failed to save full profile for user %s",
                user.email,
            )

            return Response(
                {"message": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get(self, request):
        """Retrieves the full profile state and current preference selections"""

        user = request.user
        profile = user.userprofile

        data = {
            "nickname": profile.nickname,
            "avatar": profile.avatar,
            "age": profile.age,
            "country": profile.country,
            "gender": profile.gender,
            "preferences_text": profile.preferences_text,
            "selectedOptions": list(
                user.preferences.values_list("preference_option_id", flat=True)
            ),
        }
        return Response(data)

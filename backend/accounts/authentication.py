from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTAuthenticationCustom(JWTAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('access_token')
        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)
            if not user or not user.is_active:
                return None

        except Exception:
            return None

        return (user, validated_token)

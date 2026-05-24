from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AuthStatusView,
    CookieTokenObtainPairView,
    GoogleLoginView,
    LogoutView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    ProfileSaveFullView,
    RegisterView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path(
        "login/", CookieTokenObtainPairView.as_view(), name="cookie_token_obtain_pair"
    ),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("status/", AuthStatusView.as_view(), name="auth-status"),
    path(
        "password-reset/",
        PasswordResetRequestView.as_view(),
        name="password_reset_request",
    ),
    path(
        "password-reset-confirm/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("google/", GoogleLoginView.as_view(), name="google-login"),
    path("profile/save-full/", ProfileSaveFullView.as_view(), name="profile-save-full"),
]

from django.urls import path
from .views import CookieTokenObtainPairView, RegisterView, AuthStatusView, PasswordResetRequestView, PasswordResetConfirmView, LogoutView, GoogleLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CookieTokenObtainPairView.as_view(),
         name='cookie_token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('status/', AuthStatusView.as_view(), name='auth-status'),
    path('password-reset/', PasswordResetRequestView.as_view(),
         name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),

]

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, max_length=255, verbose_name=_("Email"))
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated at"))

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    GENDER_CHOICES = [("M", _("Male")), ("F", _("Female"))]

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True,
        verbose_name=_("User"),
    )

    nickname = models.CharField(max_length=50, blank=True, verbose_name=_("Nickname"))
    age = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_("Age"),
    )
    country = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_("Country"),
    )
    avatar = models.CharField(
        max_length=255,
        default="default_avatar.png",
        null=True,
        blank=True,
        verbose_name=_("Avatar"),
    )
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        null=True,
        blank=True,
        verbose_name=_("Gender"),
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created at"),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated at"),
    )

    class Meta:
        verbose_name = _("User profile")
        verbose_name_plural = _("User profiles")

    def __str__(self):
        return f"Profile of {self.user.email}"

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from pgvector.django import VectorField
from ai.services import generate_embedding

class CustomUser(AbstractUser):
    """
    Custom user model using email as the primary identifier
    """

    email = models.EmailField(unique=True, max_length=255, verbose_name=_("Email"))
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated at"))

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    """Personal details and travel preferences for a user"""

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
    preferences_text = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("Travel Context / Wishes"),
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created at"),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated at"),
    )

    interests_embedding = VectorField(dimensions=384, null=True, blank=True)

    def generate_interests_vector(self):
        user_prefs = self.user.preferences.select_related(
            "preference_option", "preference_option__category"
        )

        pref_labels = []
        for up in user_prefs:
            opt = up.preference_option
            cat = opt.category

            cat_name = (
                getattr(cat, "name_uk", None)
                or getattr(cat, "name_en", None)
                or cat.name
            )
            opt_name = (
                getattr(opt, "name_uk", None)
                or getattr(opt, "name_en", None)
                or opt.name
            )
            pref_labels.append(f"{cat_name}: {opt_name}")

        tags_text = ", ".join(pref_labels)
        user_wishes = self.preferences_text or ""

        full_context = " ".join(filter(None, [tags_text, user_wishes]))

        if full_context:
            # from ai.services import generate_embedding

            try:
                new_vector = generate_embedding(full_context)

                UserProfile.objects.filter(pk=self.pk).update(
                    interests_embedding=new_vector
                )
                return True
            except Exception:
                return False

        return False

    class Meta:
        verbose_name = _("User profile")
        verbose_name_plural = _("User profiles")

    def __str__(self):
        return f"Profile of {self.user.email}"

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class PreferenceCategory(models.Model):
    """
    Broad categories for user interests (e.g., Food, Arts)
    """

    name = models.CharField(
        max_length=100, unique=True, verbose_name=_("Category Name")
    )

    class Meta:
        ordering = ["name"]
        verbose_name = _("Preference Category")
        verbose_name_plural = _("Preference Categories")

    def __str__(self):
        return self.name


class PreferenceOption(models.Model):
    """
    Specific choices within a category (e.g., Italian, Museums)
    """

    category = models.ForeignKey(
        PreferenceCategory,
        on_delete=models.CASCADE,
        related_name="options",
        verbose_name=_("Category"),
    )
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["name"]
        verbose_name = _("Option")
        verbose_name_plural = _("Preference options")
        constraints = [
            models.UniqueConstraint(
                fields=["category", "name"], name="unique_option_per_category"
            )
        ]

    def __str__(self):
        return f"{self.category.name}: {self.name}"


class UserPreference(models.Model):
    """
    Mapping of users to their selected preference options
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="preferences",
        verbose_name=_("User"),
    )
    preference_option = models.ForeignKey(
        PreferenceOption, on_delete=models.CASCADE, verbose_name=_("Preference option")
    )

    class Meta:
        verbose_name = _("User preference")
        verbose_name_plural = _("User preferences")
        constraints = [
            models.UniqueConstraint(
                fields=["user", "preference_option"], name="unique_user_preference"
            )
        ]

    def __str__(self):
        return f"{self.user.email} → {self.preference_option.name}"

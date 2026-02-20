from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class PreferencesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "preferences"
    verbose_name = _("Preferences")

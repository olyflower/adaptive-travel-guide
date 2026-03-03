from django.db import models
from preferences.models import PreferenceCategory
from django.utils.translation import gettext_lazy as _


class City(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name=_("City Name"))
    country = models.CharField(max_length=100, verbose_name=_("Country"))
    country_code = models.CharField(max_length=2, verbose_name=_("Country Code"))

    lat = models.FloatField(null=True, blank=True, verbose_name=_("Latitude"))
    lon = models.FloatField(null=True, blank=True, verbose_name=_("Longitude"))

    class Meta:
        ordering = ["name"]
        verbose_name = _("City")
        verbose_name_plural = _("Cities")

    def __str__(self):
        return f"{self.name}, {self.country}"


class Location(models.Model):
    city = models.ForeignKey(
        City, on_delete=models.CASCADE, related_name="locations", verbose_name=_("City")
    )
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    category = models.ForeignKey(
        PreferenceCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Category"),
    )
    address = models.CharField(max_length=255, blank=True, verbose_name=_("Address"))

    lat = models.FloatField(verbose_name=_("Latitude"))
    lon = models.FloatField(verbose_name=_("Longitude"))

    description = models.TextField(verbose_name=_("Description"))

    embedding = models.JSONField(
        null=True, blank=True, verbose_name=_("Vector Embedding")
    )

    class Meta:
        verbose_name = _("Location")
        verbose_name_plural = _("Locations")

    def __str__(self):
        return f"{self.name} ({self.city.name})"

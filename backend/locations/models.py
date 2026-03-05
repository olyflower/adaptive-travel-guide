from django.db import models
from preferences.models import PreferenceCategory
from pgvector.django import VectorField
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

    embedding = VectorField(dimensions=384, null=True, blank=True)

    def save(self, *args, **kwargs):
        current_description = (
            getattr(self, "description_uk", None)
            or getattr(self, "description_en", None)
            or self.description
        )
        current_name = (
            getattr(self, "name_uk", None)
            or getattr(self, "name_en", None)
            or self.name
        )

        current_full_text = (
            f"{current_name}. {current_description}"
            if current_description
            else current_name
        )

        should_update_embedding = False

        if not self.pk:

            should_update_embedding = True
        else:
            try:
                old_instance = Location.objects.get(pk=self.pk)
                old_description = (
                    getattr(old_instance, "description_uk", None)
                    or getattr(old_instance, "description_en", None)
                    or old_instance.description
                )
                old_name = (
                    getattr(old_instance, "name_uk", None)
                    or getattr(old_instance, "name_en", None)
                    or old_instance.name
                )
                old_full_text = (
                    f"{old_name}. {old_description}" if old_description else old_name
                )

                if current_full_text != old_full_text:
                    should_update_embedding = True
            except Location.DoesNotExist:
                should_update_embedding = True

        if current_full_text and (should_update_embedding or self.embedding is None):
            from .services import generate_embedding

            try:
                self.embedding = generate_embedding(current_full_text)
            except Exception as e:
                print(f"AI Error during saving location {self.name}: {e}")

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Location")
        verbose_name_plural = _("Locations")

    def __str__(self):
        return f"{self.name} ({self.city.name})"

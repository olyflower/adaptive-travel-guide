from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import City, Location


class CityAdmin(TranslationAdmin):
    list_display = ("id", "name", "country", "country_code", "lat", "lon")
    search_fields = ("name", "country")
    ordering = ("name",)


class LocationAdmin(TranslationAdmin):
    list_display = ("id", "name", "city", "category")
    list_filter = ("city", "category")
    search_fields = ("name", "city__name", "description")
    ordering = ("id", "city")
    autocomplete_fields = ("city",)
    readonly_fields = ("embedding",)


admin.site.register(City, CityAdmin)
admin.site.register(Location, LocationAdmin)

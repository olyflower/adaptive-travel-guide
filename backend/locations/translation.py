from modeltranslation.translator import register, TranslationOptions
from .models import City, Location


@register(City)
class CityTranslationOptions(TranslationOptions):
    fields = ("name", "country")


@register(Location)
class LocationTranslationOptions(TranslationOptions):
    fields = ("name", "description")

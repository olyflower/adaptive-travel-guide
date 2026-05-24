from modeltranslation.translator import TranslationOptions, register

from .models import PreferenceCategory, PreferenceOption


@register(PreferenceCategory)
class PreferenceCategoryTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(PreferenceOption)
class PreferenceOptionTranslationOptions(TranslationOptions):
    fields = ("name",)

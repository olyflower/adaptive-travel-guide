from django.contrib import admin
from .models import (
    TripPlan,
    Recommendation,
    WeatherForecast,
    CurrencyRate,
    LanguagePhrase,
)


class RecommendationInline(admin.TabularInline):
    model = Recommendation
    extra = 1


class WeatherForecastInline(admin.TabularInline):
    model = WeatherForecast
    extra = 1


class CurrencyRateInline(admin.TabularInline):
    model = CurrencyRate
    extra = 1


class LanguagePhraseInline(admin.TabularInline):
    model = LanguagePhrase
    extra = 1


@admin.register(TripPlan)
class TripPlanAdmin(admin.ModelAdmin):
    list_display = ("city", "user", "start_date", "end_date", "created_at")
    list_filter = ("city", "user", "start_date")
    search_fields = (
        "city__name_en",
        "city__name_uk",
        "user__username",
    )

    inlines = [
        RecommendationInline,
        WeatherForecastInline,
        CurrencyRateInline,
        LanguagePhraseInline,
    ]


admin.site.register(Recommendation)
admin.site.register(WeatherForecast)
admin.site.register(CurrencyRate)
admin.site.register(LanguagePhrase)

from django.contrib import admin

from .models import (
    LanguagePhrase,
    Recommendation,
    TripPlan,
)


class RecommendationInline(admin.TabularInline):
    model = Recommendation
    extra = 1


class LanguagePhraseInline(admin.TabularInline):
    model = LanguagePhrase
    extra = 1


@admin.register(TripPlan)
class TripPlanAdmin(admin.ModelAdmin):
    list_display = ("id", "city", "user", "start_date", "end_date", "created_at")
    list_filter = ("city", "user", "start_date")
    search_fields = (
        "city__name_en",
        "city__name_uk",
        "user__username",
    )

    inlines = [
        RecommendationInline,
        LanguagePhraseInline,
    ]


admin.site.register(Recommendation)
admin.site.register(LanguagePhrase)

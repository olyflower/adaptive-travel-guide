from django.contrib import admin
from django.db.models import Count
from .models import PreferenceCategory, PreferenceOption, UserPreference


class PreferenceCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "options_count")
    search_fields = ("name",)
    ordering = ("name",)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_options_count=Count("options"))

    def options_count(self, obj):
        return obj._options_count

    options_count.short_description = "Options"
    options_count.admin_order_field = "_options_count"


class PreferenceOptionAdmin(admin.ModelAdmin):
    list_display = ("id", "category", "name")
    list_filter = ("category",)
    search_fields = ("name", "category__name")
    ordering = ("id", "category")
    autocomplete_fields = ("category",)


class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "preference_option", "category")
    list_filter = ("preference_option__category",)
    search_fields = ("user__email", "preference_option__name")
    autocomplete_fields = ("user", "preference_option")
    ordering = ("user",)

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("user", "preference_option__category")
        )

    def category(self, obj):
        return obj.preference_option.category if obj.preference_option else "-"

    category.short_description = "Category"
    category.admin_order_field = "preference_option__category"


admin.site.register(PreferenceCategory, PreferenceCategoryAdmin)
admin.site.register(PreferenceOption, PreferenceOptionAdmin)
admin.site.register(UserPreference, UserPreferenceAdmin)

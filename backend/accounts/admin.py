from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile
from preferences.models import UserPreference


class UserPreferenceInline(admin.TabularInline):
    model = UserPreference
    extra = 1
    autocomplete_fields = ("preference_option",)


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    inlines = [UserPreferenceInline]
    list_display = ("email", "username", "is_staff", "is_active", "created_at")
    list_filter = ("is_staff", "is_active")
    search_fields = ("email", "username")
    ordering = ("email",)

    readonly_fields = ("created_at", "updated_at")

    fieldsets = UserAdmin.fieldsets + (
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )


class UserProfileAdmin(admin.ModelAdmin):

    list_display = ("user", "nickname", "age", "country", "gender")
    search_fields = (
        "user__email",
        "user__username",
        "country",
    )
    list_filter = (
        "gender",
        "country",
        "created_at",
    )
    exclude = ("interests_embedding",)

    readonly_fields = ("created_at", "updated_at", "get_preferences")

    fieldsets = (
        ("User Info", {"fields": ("user",)}),
        (
            "Profile Data",
            {
                "fields": (
                    "nickname",
                    "age",
                    "country",
                    "gender",
                    "avatar",
                    "preferences_text",
                    "get_preferences",
                )
            },
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )

    ordering = ("-created_at",)

    @admin.display(description="Preferences")
    def get_preferences(self, obj):
        return ", ".join(
            str(up.preference_option)
            for up in obj.user.preferences.select_related("preference_option__category")
        )


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)

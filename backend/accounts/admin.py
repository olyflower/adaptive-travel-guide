from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile


class CustomUserAdmin(UserAdmin):
    model = CustomUser
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
    list_display = (
        "user",
        "nickname",
        "age",
        "country",
        "gender",
        "created_at",
        "updated_at",
    )
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

    readonly_fields = ("created_at", "updated_at", "interests_embedding")

    fieldsets = (
        ("User Info", {"fields": ("user",)}),
        (
            "Profile Data",
            {"fields": ("nickname", "age", "country", "gender", "avatar")},
        ),
        (
            "AI Analytics",
            {"classes": ("collapse",), "fields": ("interests_embedding",)},
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )

    ordering = ("-created_at",)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)

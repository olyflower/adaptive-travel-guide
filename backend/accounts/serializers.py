from rest_framework import serializers
from .models import CustomUser, UserProfile
from django.contrib.auth import get_user_model


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the user profile model

    Includes a computed field `profile_complete` that indicates
    whether the user has completed their profile
    """

    profile_complete = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = (
            "nickname",
            "age",
            "country",
            "avatar",
            "gender",
            "preferences_text",
            "created_at",
            "updated_at",
            "profile_complete",
        )
        read_only_fields = ("user", "created_at", "updated_at")

    def get_profile_complete(self, obj):
        """
        Determines if the profile is complete

        A profile is considered complete if:
        - the user has provided non-empty preferences text, or
        - the user has selected at least one preference
        """

        has_text = bool(obj.preferences_text and obj.preferences_text.strip())
        has_preferences = obj.user.preferences.exists()
        return has_text or has_preferences


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom user model

    Includes a nested read-only user profile
    """

    profile = UserProfileSerializer(source="userprofile", read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "username", "profile"]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration

    Uses Django's `create_user` method to ensure
    proper password hashing
    """

    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ["id", "email", "password", "username"]

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

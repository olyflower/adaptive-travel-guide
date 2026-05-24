from django.db import transaction
from rest_framework import serializers

from .models import PreferenceCategory, PreferenceOption, UserPreference


class PreferenceOptionSerializer(serializers.ModelSerializer):
    """
    Serializer for individual preference options with multilingual support
    """

    class Meta:
        model = PreferenceOption
        fields = ["id", "name", "name_uk", "name_en"]


class PreferenceCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for grouping preference options into logical categories
    """

    options = PreferenceOptionSerializer(many=True, read_only=True)

    class Meta:
        model = PreferenceCategory
        fields = ["id", "name", "name_uk", "name_en", "options"]


class UserPreferenceSaveSerializer(serializers.Serializer):
    """
    Custom serializer for batch saving user preferences
    Validates option IDs and performs an atomic sync with the database
    """

    option_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )

    def validate_option_ids(self, value):
        """Ensures all provided preference option IDs exist in the database"""

        if PreferenceOption.objects.filter(id__in=value).count() != len(value):
            raise serializers.ValidationError("One or more options are invalid")
        return value

    def save_preferences(self, user):
        """
        Syncs user preferences by removing old records and creating new ones in bulk
        """

        option_ids = self.validated_data["option_ids"]

        with transaction.atomic():
            UserPreference.objects.filter(user=user).delete()

            new_prefs = [
                UserPreference(user=user, preference_option_id=oid)
                for oid in option_ids
            ]

            UserPreference.objects.bulk_create(new_prefs)

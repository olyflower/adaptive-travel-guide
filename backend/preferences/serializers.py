from rest_framework import serializers
from .models import PreferenceCategory, PreferenceOption, UserPreference


class PreferenceOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreferenceOption
        fields = ["id", "name", "name_uk", "name_en"]


class PreferenceCategorySerializer(serializers.ModelSerializer):
    options = PreferenceOptionSerializer(many=True, read_only=True)

    class Meta:
        model = PreferenceCategory
        fields = ["id", "name", "name_uk", "name_en", "options"]


class UserPreferenceSaveSerializer(serializers.Serializer):
    option_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )

    def validate_option_ids(self, value):

        if PreferenceOption.objects.filter(id__in=value).count() != len(value):
            raise serializers.ValidationError("One or more options are invalid")
        return value

    def save_preferences(self, user):
        option_ids = self.validated_data["option_ids"]
        UserPreference.objects.filter(user=user).delete()

        new_prefs = [
            UserPreference(user=user, preference_option_id=oid) for oid in option_ids
        ]
        UserPreference.objects.bulk_create(new_prefs)

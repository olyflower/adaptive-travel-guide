from rest_framework import serializers
from .models import (
    TripPlan,
    Recommendation,
    LanguagePhrase,
)
from locations.serializers import CitySerializer, LocationSerializer


class LanguagePhraseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguagePhrase
        fields = ["phrase_origin", "phrase_translation", "language_code"]


class RecommendationSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    class Meta:
        model = Recommendation
        fields = ["id", "location", "day", "note"]


class TripPlanSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    recommendations = RecommendationSerializer(many=True, read_only=True)
    phrases = LanguagePhraseSerializer(many=True, read_only=True)

    class Meta:
        model = TripPlan
        fields = [
            "id",
            "city",
            "start_date",
            "end_date",
            "recommendations",
            "phrases",
            "created_at",
        ]

    def validate(self, data):
        start_date = data.get("start_date", getattr(self.instance, "start_date", None))
        end_date = data.get("end_date", getattr(self.instance, "end_date", None))

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be earlier than start date."}
            )

        return data

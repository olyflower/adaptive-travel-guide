from rest_framework import serializers

from locations.serializers import CitySerializer, LocationSerializer

from .models import (
    LanguagePhrase,
    Recommendation,
    TripPlan,
)


class LanguagePhraseSerializer(serializers.ModelSerializer):
    """
    Serializer for basic travel phrases in the destination's language
    """

    class Meta:
        model = LanguagePhrase
        fields = ["phrase_origin", "phrase_translation", "language_code"]


class RecommendationSerializer(serializers.ModelSerializer):
    """
    Serializer for individual trip points, including detailed location info
    """

    location = LocationSerializer(read_only=True)

    class Meta:
        model = Recommendation
        fields = ["id", "location", "day", "note"]


class TripPlanSerializer(serializers.ModelSerializer):
    """
    Core serializer for trip plans, aggregating cities,
    recommendations, and language phrases into a single response
    """

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
        """
        Ensures the trip duration is logical by checking start and end dates
        """

        start_date = data.get("start_date", getattr(self.instance, "start_date", None))
        end_date = data.get("end_date", getattr(self.instance, "end_date", None))

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be earlier than start date."}
            )

        return data

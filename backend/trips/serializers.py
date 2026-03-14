from rest_framework import serializers
from .models import (
    TripPlan,
    Recommendation,
    WeatherForecast,
    CurrencyRate,
    LanguagePhrase,
)
from locations.serializers import CitySerializer, LocationSerializer


class WeatherForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherForecast
        fields = ["date", "temp_min", "temp_max", "description"]


class CurrencyRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyRate
        fields = ["currency_code", "rate", "date"]


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
    weather_forecasts = WeatherForecastSerializer(many=True, read_only=True)
    currency_rates = CurrencyRateSerializer(many=True, read_only=True)
    phrases = LanguagePhraseSerializer(many=True, read_only=True)

    class Meta:
        model = TripPlan
        fields = [
            "id",
            "city",
            "start_date",
            "end_date",
            "recommendations",
            "weather_forecasts",
            "currency_rates",
            "phrases",
            "created_at",
        ]

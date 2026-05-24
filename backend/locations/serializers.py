from rest_framework import serializers

from trips.models import Recommendation

from .models import City, Location


class CitySerializer(serializers.ModelSerializer):
    """
    Serializer for city data including localized names and country codes
    """

    class Meta:
        model = City
        fields = ["id", "name", "name_uk", "name_en", "country", "country_code"]


class LocationSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for locations
    Includes nested city data and a dynamic status of whether the location is in the user's trip
    """

    is_in_trip = serializers.SerializerMethodField()
    city = CitySerializer(read_only=True)
    category = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = [
            "id",
            "name",
            "name_uk",
            "name_en",
            "city",
            "category",
            "address",
            "lat",
            "lon",
            "description",
            "description_uk",
            "description_en",
            "is_in_trip",
        ]

    def get_category(self, obj):
        """
        Returns a formatted dictionary of the location category
        """

        if obj.category:
            return {
                "id": obj.category.id,
                "name": obj.category.name,
                "name_uk": getattr(obj.category, "name_uk", None),
                "name_en": getattr(obj.category, "name_en", None),
            }
        return None

    def get_is_in_trip(self, obj):
        """
        Determines if the current authenticated user has already added
        this location to any of their trip plans
        """

        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            return False

        return Recommendation.objects.filter(
            location=obj,
            trip_plan__user=user,
        ).exists()

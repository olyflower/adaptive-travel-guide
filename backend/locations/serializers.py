from rest_framework import serializers
from .models import City, Location


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name", "country", "country_code"]


class LocationSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source="city.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Location
        fields = [
            "id",
            "name",
            "city_name",
            "category_name",
            "address",
            "lat",
            "lon",
            "description",
        ]

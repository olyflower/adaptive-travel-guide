from rest_framework import serializers
from .models import Location


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

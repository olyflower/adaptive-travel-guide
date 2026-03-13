from rest_framework import serializers
from .models import City, Location


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name", "name_uk", "name_en", "country", "country_code"]


class LocationSerializer(serializers.ModelSerializer):
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
        ]

    def get_category(self, obj):
        if obj.category:
            return {
                "id": obj.category.id,
                "name": obj.category.name,
                "name_uk": getattr(obj.category, "name_uk", None),
                "name_en": getattr(obj.category, "name_en", None),
            }
        return None

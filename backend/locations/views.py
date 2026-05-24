from django.db.models import Q
from pgvector.django import CosineDistance
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from config.constants import (
    MAX_RECOMMENDATIONS,
    RECOMMENDATION_SIMILARITY_THRESHOLD,
)

from .models import City, Location
from .serializers import CitySerializer, LocationSerializer


class CityListView(ListAPIView):
    """
    Provides a simple list of all supported cities in the system
    """

    queryset = City.objects.all()
    serializer_class = CitySerializer


class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        target_city = request.query_params.get("city")
        user_profile = getattr(request.user, "userprofile", None)

        if not user_profile or user_profile.interests_embedding is None:
            return Response(
                {"error": "Fill profile"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not target_city:
            return Response(
                {"error": "City parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        target_city = target_city.strip()

        city = City.objects.filter(
            Q(name_uk__iexact=target_city)
            | Q(name_en__iexact=target_city)
            | Q(name__iexact=target_city)
        ).first()

        if not city:
            return Response(
                {"error": "City not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_vector = user_profile.interests_embedding
        distance_expr = CosineDistance("embedding", user_vector)

        queryset = (
            Location.objects.select_related("city", "category")
            .filter(city=city)
            .annotate(distance=distance_expr)
            .filter(distance__lt=RECOMMENDATION_SIMILARITY_THRESHOLD)
            .order_by("distance")[:MAX_RECOMMENDATIONS]
        )

        city_data = CitySerializer(city).data
        locations_data = LocationSerializer(
            queryset,
            many=True,
            context={"request": request},
        ).data

        return Response(
            {
                "city": city_data,
                "locations": locations_data,
            }
        )

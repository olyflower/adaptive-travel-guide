from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from pgvector.django import CosineDistance
from django.db.models import Q
from .models import City, Location
from .serializers import CitySerializer, LocationSerializer


class CityListView(ListAPIView):
    """
    Provides a simple list of all supported cities in the system
    """

    queryset = City.objects.all()
    serializer_class = CitySerializer


class RecommendationView(APIView):
    """
    Core recommendation engine 
    Uses vector similarity search (Cosine Distance) to match locations 
    with the user's personal interests and travel context
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieves top personalized recommendations for a specific city
        Calculates semantic distance between user's profile embedding and location embeddings
        """

        target_city = request.query_params.get("city")
        user_profile = getattr(request.user, "userprofile", None)
        if not user_profile or user_profile.interests_embedding is None:
            return Response(
                {"error": "Fill profile"}, status=status.HTTP_400_BAD_REQUEST
            )

        user_vector = user_profile.interests_embedding
        distance_expr = CosineDistance("embedding", user_vector)

        queryset = Location.objects.select_related("city", "category").annotate(
            distance=distance_expr
        )

        if target_city:
            target_city = target_city.strip()
            queryset = queryset.filter(
                Q(city__name_uk__iexact=target_city)
                | Q(city__name_en__iexact=target_city)
                | Q(city__name__iexact=target_city)
            )

        queryset = queryset.filter(distance__lt=0.6)

        recommended_locations = queryset.order_by("distance")[:5]

        print(f"Found {len(recommended_locations)} recommendations:")
        for loc in recommended_locations:
            print(f"- {loc.name} (ID: {loc.id})")

        serializer = LocationSerializer(recommended_locations, many=True)
        return Response(serializer.data)

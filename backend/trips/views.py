from rest_framework.views import APIView
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TripPlan, Recommendation
from .serializers import TripPlanSerializer, RecommendationSerializer
from rest_framework.permissions import IsAuthenticated

from .models import City
from live_data.services import get_weather_data, get_currency_rate_for_country


class TripPlanViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for user trip plans
    Provides a custom action to quickly add locations to a plan
    """

    serializer_class = TripPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TripPlan.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def add_location(self, request):
        city_id = request.data.get("city_id")
        location_id = request.data.get("location_id")

        if not city_id or not location_id:
            return Response(
                {"error": "Missing data"}, status=status.HTTP_400_BAD_REQUEST
            )

        trip_plan, created = TripPlan.objects.get_or_create(
            user=request.user, city_id=city_id
        )

        recommendation, rec_created = Recommendation.objects.get_or_create(
            trip_plan=trip_plan, location_id=location_id
        )

        return Response(
            {
                "status": "added",
                "trip_plan_id": trip_plan.id,
                "recommendation_id": recommendation.id,
                "created_new_plan": created,
            },
            status=status.HTTP_201_CREATED,
        )


class RecommendationViewSet(viewsets.ModelViewSet):
    """
    Manages saved recommendations inside user trip plans
    """

    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Recommendation.objects.filter(trip_plan__user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        recommendation = self.get_object()
        self.perform_destroy(recommendation)
        return Response(
            {"status": "location removed from plan"},
            status=status.HTTP_200_OK,
        )


class CityTravelInfoView(APIView):
    """
    Returns current weather and currency information for the selected city
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, city_id):
        city = City.objects.filter(id=city_id).first()

        if not city:
            return Response(
                {"error": "City not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        weather = get_weather_data(city=city.name)
        currency = get_currency_rate_for_country(city.country_code)

        return Response(
            {
                "weather": weather,
                "currency": currency,
            },
            status=status.HTTP_200_OK,
        )

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import requests

from live_data.services import get_currency_rate_for_country, get_weather_data

from .models import City, Recommendation, TripPlan
from .serializers import RecommendationSerializer, TripPlanSerializer


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

    @action(detail=True, methods=["get"])
    def generate_route(self, request, pk=None):
        trip_plan = self.get_object()

        start_point = {
            "name": trip_plan.city.name,
            "lat": trip_plan.city.lat,
            "lon": trip_plan.city.lon,
        }

        locations = []

        coordinates = [f"{start_point['lon']},{start_point['lat']}"]

        for recommendation in trip_plan.recommendations.all():
            location = recommendation.location

            locations.append(
                {
                    "id": location.id,
                    "name": location.name,
                    "lat": location.lat,
                    "lon": location.lon,
                }
            )

            coordinates.append(f"{location.lon},{location.lat}")

        if not locations:
            return Response(
                {"error": "No locations added to this trip plan"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        coordinates_string = ";".join(coordinates)

        trip_url = (
            "https://router.project-osrm.org/trip/v1/driving/"
            f"{coordinates_string}"
            "?overview=full"
            "&geometries=geojson"
            "&roundtrip=false"
            "&source=first"
        )

        try:
            response = requests.get(trip_url, timeout=5)
            response.raise_for_status()
            route_data = response.json()

        except requests.exceptions.RequestException:
            return Response(
                {"error": "Routing service is temporarily unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if route_data.get("code") != "Ok":
            return Response(
                {
                    "error": route_data.get(
                        "message",
                        "Unable to generate route",
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        trip = route_data["trips"][0]

        return Response(
            {
                "trip_plan_id": trip_plan.id,
                "city": trip_plan.city.name,
                "start_point": start_point,
                "locations": locations,
                "distance_km": round(
                    trip["distance"] / 1000,
                    1,
                ),
                "duration_min": round(trip["duration"] / 60),
                "route_geometry": trip["geometry"],
            },
            status=status.HTTP_200_OK,
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

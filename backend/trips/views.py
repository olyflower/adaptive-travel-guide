from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TripPlan, Recommendation
from .serializers import TripPlanSerializer, RecommendationSerializer


class TripPlanViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for user trip plans
    Provides a custom action to quickly add locations to a plan
    """

    serializer_class = TripPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Returns only the trip plans belonging to the authenticated user"""

        return TripPlan.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def add_location(self, request):
        """
        Custom endpoint to add a location to a trip plan
        Automatically creates a new TripPlan if one doesn't exist for the city
        """

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
    Manages specific recommendations within trip plans
    Allows users to delete locations or update personal notes
    """

    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filters recommendations to only show those owned by the current user"""
        
        return Recommendation.objects.filter(trip_plan__user=self.request.user)

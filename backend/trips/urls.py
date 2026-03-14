from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripPlanViewSet, RecommendationViewSet

router = DefaultRouter()
router.register(r"plans", TripPlanViewSet, basename="trip-plan")
router.register(r"recommendations", RecommendationViewSet, basename="recommendation")

urlpatterns = [
    path("", include(router.urls)),
]

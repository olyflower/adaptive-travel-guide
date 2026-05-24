from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CityTravelInfoView, RecommendationViewSet, TripPlanViewSet

router = DefaultRouter()
router.register(r"plans", TripPlanViewSet, basename="trip-plan")
router.register(
    r"recommendations",
    RecommendationViewSet,
    basename="trip-recommendation",
)


urlpatterns = [
    path("", include(router.urls)),
    path("cities/<int:city_id>/travel-info/", CityTravelInfoView.as_view()),
]

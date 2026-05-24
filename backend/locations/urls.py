from django.urls import path

from .views import CityListView, RecommendationView

urlpatterns = [
    path("cities/", CityListView.as_view(), name="city-list"),
    path("recommendations/", RecommendationView.as_view(), name="recommendations"),
]

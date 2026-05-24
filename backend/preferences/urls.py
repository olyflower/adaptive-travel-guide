from django.urls import path

from .views import AllPreferencesListView, SaveUserPreferencesView

urlpatterns = [
    path("all/", AllPreferencesListView.as_view(), name="all-preferences"),
    path("save/", SaveUserPreferencesView.as_view(), name="save-preferences"),
]

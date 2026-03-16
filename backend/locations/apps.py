from django.apps import AppConfig


class LocationsConfig(AppConfig):
    name = "locations"


class TripsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "trips"

    def ready(self):
        import trips.signals

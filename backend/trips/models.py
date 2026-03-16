from django.db import models
from django.conf import settings
from locations.models import City, Location


class TripPlan(models.Model):
    """
    Trip plan for a user for a specific city
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="plans"
    )
    city = models.ForeignKey(
        City,
        on_delete=models.CASCADE,
        related_name="trip_plans",
        verbose_name="Destination City",
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} - {self.user}"


class Recommendation(models.Model):
    """
    Selected locations and activities within a trip
    """

    trip_plan = models.ForeignKey(
        TripPlan, on_delete=models.CASCADE, related_name="recommendations"
    )
    location = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="trip_recommendations"
    )
    day = models.DateField(null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ("trip_plan", "location")
        ordering = ["day"]

    def __str__(self):
        return f"{self.location} in {self.trip_plan.city}"


class WeatherForecast(models.Model):
    """
    Daily weather forecast for a trip plan
    """

    trip_plan = models.ForeignKey(
        TripPlan, on_delete=models.CASCADE, related_name="weather_forecasts"
    )
    date = models.DateField()
    temp_min = models.FloatField()
    temp_max = models.FloatField()
    description = models.CharField(max_length=255)

    class Meta:
        unique_together = ("trip_plan", "date")

    def __str__(self):
        return f"Weather for {self.trip_plan.city} on {self.date}"


class CurrencyRate(models.Model):
    """
    Exchange rates relevant to the travel destination
    """

    trip_plan = models.ForeignKey(
        TripPlan, on_delete=models.CASCADE, related_name="currency_rates"
    )
    currency_code = models.CharField(max_length=3)
    rate = models.DecimalField(max_digits=10, decimal_places=4)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.currency_code} rate for {self.trip_plan.id}"


class LanguagePhrase(models.Model):
    """Useful phrase and translation for a trip plan"""

    trip_plan = models.ForeignKey(
        TripPlan, on_delete=models.CASCADE, related_name="phrases"
    )
    phrase_origin = models.TextField()
    phrase_translation = models.TextField()
    language_code = models.CharField(
        max_length=10,
        choices=[
            ("en", "English"),
            ("uk", "Ukrainian"),
            ("es", "Spanish"),
            ("fr", "French"),
        ],
    )

    def __str__(self):
        return f"Phrase for {self.trip_plan.city}"

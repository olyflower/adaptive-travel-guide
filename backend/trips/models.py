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
            ("pl", "Polish"),
            ("it", "Italian"),
            ("de", "German"),
        ],
    )

    def __str__(self):
        return f"Phrase for {self.trip_plan.city}"

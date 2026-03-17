from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import TripPlan, LanguagePhrase

"""
Signals that automatically enrich a TripPlan after creation.

Key behaviors:
- Runs only on TripPlan creation (post_save with created=True)
- Determines language from the destination country code
- Falls back to English if the language is not supported
- Uses bulk_create for efficient database insertion
"""

DESTINATION_LANG = {
    "FR": "fr",
    "DE": "de",
    "PL": "pl",
    "GB": "en",
    "UA": "uk",
    "ES": "es",
    "IT": "it",
}


PHRASES = {
    "fr": [
        ("Bonjour", "Привіт"),
        ("Merci", "Дякую"),
        ("S'il vous plaît", "Будь ласка"),
    ],
    "en": [
        ("Hello", "Привіт"),
        ("Thank you", "Дякую"),
        ("Please", "Будь ласка"),
    ],
    "pl": [
        ("Dzień dobry", "Привіт"),
        ("Dziękuję", "Дякую"),
        ("Proszę", "Будь ласка"),
    ],
    "it": [
        ("Ciao", "Привіт"),
        ("Grazie", "Дякую"),
        ("Per favore", "Будь ласка"),
    ],
    "de": [
        ("Hallo", "Привіт"),
        ("Danke", "Дякую"),
        ("Bitte", "Будь ласка"),
    ],
    "es": [
        ("Hola", "Привіт"),
        ("Gracias", "Дякую"),
        ("Por favor", "Будь ласка"),
    ],
    "uk": [
        ("Привіт", "Hello"),
        ("Дякую", "Thank you"),
        ("Будь ласка", "Please"),
    ],
}


@receiver(post_save, sender=TripPlan)
def enrich_trip_plan(sender, instance, created, **kwargs):
    """
    Triggered when a new TripPlan is saved
    Initiates the process of adding destination-specific data
    """

    if not created:
        return

    create_trip_phrases(instance)


def create_trip_phrases(trip_plan):
    """
    Identifies the destination language and populates the trip plan
    with a predefined list of essential travel phrases
    """

    if trip_plan.phrases.exists():
        return

    country_code = (trip_plan.city.country_code or "").upper()
    lang_code = DESTINATION_LANG.get(country_code, "en")
    phrase_list = PHRASES.get(lang_code, PHRASES["en"])

    # Create LanguagePhrase objects in memory
    phrases = [
        LanguagePhrase(
            trip_plan=trip_plan,
            phrase_origin=origin,
            phrase_translation=translation,
            language_code=lang_code,
        )
        for origin, translation in phrase_list
    ]

    # Efficiently insert all phrases into the database in a single query
    LanguagePhrase.objects.bulk_create(phrases)

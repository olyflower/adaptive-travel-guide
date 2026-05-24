import logging

import requests
from django.conf import settings

from config.constants import DEFAULT_RECOMMENDATION_CITY, EXTERNAL_API_TIMEOUT

"""
Service layer for integrations with external data providers.

Responsibilities:
- Retrieve current weather data for a given location
- Convert currency using an external exchange rate API
- Determine the destination currency based on country code
"""

logger = logging.getLogger(__name__)

country_to_currency = {
    "FR": "EUR",
    "US": "USD",
    "GB": "GBP",
    "PL": "PLN",
    "DE": "EUR",
    "CZ": "CZK",
    "UA": "UAH",
    "BG": "BGN",
}


def get_weather_data(lat=None, lon=None, city=DEFAULT_RECOMMENDATION_CITY):
    """
    Fetches real-time weather data from OpenWeather API using coordinates or city name
    """

    api_key = settings.OPENWEATHER_API_KEY
    base_url = settings.OPENWEATHER_BASE_URL

    if lat and lon:
        url = (
            f"{base_url}/weather?lat={lat}&lon={lon}"
            f"&appid={api_key}&units=metric&lang=ua"
        )
    else:
        url = f"{base_url}/weather?q={city}&appid={api_key}&units=metric&lang=ua"

    try:
        response = requests.get(url, timeout=EXTERNAL_API_TIMEOUT)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException:
        logger.exception("Weather API request failed")
        return None

    return {
        "city": data.get("name"),
        "country": data["sys"].get("country"),
        "temperature": data["main"]["temp"],
        "icon": data["weather"][0]["icon"],
    }


def get_currency_rate(from_currency, to_currency="UAH"):
    """
    Fetches the exchange rate from from_currency to to_currency.
    """

    if from_currency == to_currency:
        return {"from": from_currency, "to": to_currency, "rate": 1.0}

    try:
        url = f"{settings.CURRENCY_API_BASE_URL}/latest/{from_currency}"
        response = requests.get(url, timeout=EXTERNAL_API_TIMEOUT)
        response.raise_for_status()

        data = response.json()

        if data.get("result") != "success":
            logger.warning(
                "Currency API returned invalid response body",
            )
            return None

        rates = data.get("rates")
        if not rates:
            logger.warning(
                "Currency API response missing rates",
            )
            return None

        rate = rates.get(to_currency)
        if rate is None:
            logger.warning(
                "Target currency missing in API response",
            )
            return None

        return {"from": from_currency, "to": to_currency, "rate": round(rate, 4)}

    except requests.RequestException:
        logger.exception("Currency API request failed")
        return None


def get_currency_by_country(country_code):
    """
    Helper to map a country code to its official currency code
    """

    return country_to_currency.get((country_code or "").upper())


def get_currency_rate_for_country(country_code, to_currency="UAH"):
    """
    Combines currency lookup and rate fetching for a specific country
    """

    from_currency = get_currency_by_country(country_code)

    if not from_currency:
        return None

    return get_currency_rate(from_currency=from_currency, to_currency=to_currency)

import requests
from django.conf import settings

"""
Service layer for integrations with external data providers.

Responsibilities:
- Retrieve current weather data for a given location
- Convert currency using an external exchange rate API
- Determine the destination currency based on country code
"""

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


def get_weather_data(lat=None, lon=None, city="Paris"):
    api_key = settings.OPENWEATHER_API_KEY
    base_url = settings.OPENWEATHER_BASE_URL

    if lat and lon:
        url = (
            f"{base_url}/weather?lat={lat}&lon={lon}"
            f"&appid={api_key}&units=metric&lang=ua"
        )
    else:
        url = f"{base_url}/weather?q={city}&appid={api_key}&units=metric&lang=ua"

    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()

    return {
        "city": data.get("name"),
        "country": data["sys"].get("country"),
        "temperature": data["main"]["temp"],
        "icon": data["weather"][0]["icon"],
    }


def get_currency_rate(from_currency, to_currency="UAH"):
    base_url = settings.EXCHANGERATE_BASE_URL
    api_key = settings.EXCHANGERATE_API_KEY

    url = (
        f"{base_url}/convert?access_key={api_key}"
        f"&from={from_currency}&to={to_currency}&amount=1"
    )

    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()

    if "result" not in data or data["result"] is None:
        return None

    return {
        "from": from_currency,
        "to": to_currency,
        "rate": round(data["result"], 4),
    }


def get_currency_by_country(country_code):
    return country_to_currency.get((country_code or "").upper())


def get_currency_rate_for_country(country_code, to_currency="UAH"):
    from_currency = get_currency_by_country(country_code)

    if not from_currency:
        return None

    return get_currency_rate(from_currency=from_currency, to_currency=to_currency)

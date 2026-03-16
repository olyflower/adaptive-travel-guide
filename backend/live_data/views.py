from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import status
import requests
from django.conf import settings

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


class WeatherView(APIView):
    """
    Integrates with OpenWeatherMap API to provide real-time weather data
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Fetches current weather for given coordinates or a default city
        """
        api_key = settings.OPENWEATHER_API_KEY
        base_url = settings.OPENWEATHER_BASE_URL
        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")

        if lat and lon:
            url = f"{base_url}/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=ua"
        else:
            url = f"{base_url}/weather?q=Paris&appid={api_key}&units=metric&lang=ua"

        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()

            return Response(
                {
                    "city": data.get("name"),
                    "country": data["sys"].get("country"),
                    "temperature": data["main"]["temp"],
                    "icon": data["weather"][0]["icon"],
                }
            )

        except requests.RequestException as e:
            return Response(
                {"error": "External API error", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class CurrencyExchangeView(APIView):
    """
    Integrates with external exchange rate services
    Handles currency conversion relevant to the user's travel destination
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Converts currency from a source to a target (defaulting to UAH)
        """
        base_url = settings.EXCHANGERATE_BASE_URL
        from_currency = request.query_params.get("from")
        to_currency = request.query_params.get("to", "UAH")

        if not from_currency:
            return Response(
                {"error": "Parameter 'from' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            api_key = settings.EXCHANGERATE_API_KEY
            url = f"{base_url}/convert?access_key={api_key}&from={from_currency}&to={to_currency}&amount=1"

            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()

            if "result" not in data or data["result"] is None:
                return Response(
                    {"error": "Conversion failed"}, status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {
                    "from": from_currency,
                    "to": to_currency,
                    "rate": round(data["result"], 4),
                }
            )

        except requests.RequestException as e:
            return Response(
                {"error": "Currency service error", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )


# @require_GET
# def weather(request):
#     api_key = settings.OPENWEATHER_API_KEY
#     base_url = settings.OPENWEATHER_BASE_URL
#     lat = request.GET.get("lat")
#     lon = request.GET.get("lon")

#     if lat and lon:
#         url = f"{base_url}/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=ua"
#     else:
#         city = "Paris"
#         url = f"{base_url}/weather?q={city}&appid={api_key}&units=metric&lang=ua"

#     try:
#         response = requests.get(url, timeout=5)
#         response.raise_for_status()
#         data = response.json()

#         weather_info = {
#             "city": data.get("name"),
#             "country": data["sys"].get("country"),
#             "temperature": data["main"]["temp"],
#             "icon": data["weather"][0]["icon"],
#         }

#         return JsonResponse(weather_info)

#     except RequestException as req_err:
#         return JsonResponse(
#             {"error": "RequestError", "message": str(req_err)}, status=400
#         )
#     except ValueError as json_err:
#         return JsonResponse(
#             {"error": "JSONError", "message": str(json_err)}, status=500
#         )
#     except Exception as e:
#         return JsonResponse({"error": "UnexpectedError", "message": str(e)}, status=500)


# @require_GET
# def currency(request):
#     base_url = settings.EXCHANGERATE_BASE_URL
#     from_currency = request.GET.get("from")
#     to_currency = request.GET.get("to", "UAH")

#     if not from_currency:
#         return JsonResponse(
#             {"error": "ValidationError", "message": "Missing 'from' parameter"},
#             status=400,
#         )

#     try:
#         api_key = settings.EXCHANGERATE_API_KEY
#         url = f"{base_url}/convert?access_key={api_key}&from={from_currency}&to={to_currency}&amount=1"
#         response = requests.get(url, timeout=5)
#         response.raise_for_status()
#         data = response.json()

#         if "result" not in data or data["result"] is None:
#             return JsonResponse(
#                 {"error": "APIError", "message": "Currency conversion failed"},
#                 status=400,
#             )

#         return JsonResponse(
#             {"from": from_currency, "to": to_currency, "rate": round(data["result"], 4)}
#         )

#     except RequestException as req_err:
#         return JsonResponse(
#             {"error": "RequestError", "message": str(req_err)}, status=400
#         )
#     except ValueError as json_err:
#         return JsonResponse(
#             {"error": "JSONError", "message": str(json_err)}, status=500
#         )
#     except Exception as e:
#         return JsonResponse({"error": "UnexpectedError", "message": str(e)}, status=500)

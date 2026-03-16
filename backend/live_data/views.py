from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
import requests

from .services import get_weather_data, get_currency_rate


class WeatherView(APIView):
    """
    Integrates with OpenWeatherMap API to provide real-time weather data
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Fetches current weather for given coordinates or a default city
        """
        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")

        try:
            data = get_weather_data(lat=lat, lon=lon)
            return Response(data)

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
        from_currency = request.query_params.get("from")
        to_currency = request.query_params.get("to", "UAH")

        if not from_currency:
            return Response(
                {"error": "Parameter 'from' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = get_currency_rate(
                from_currency=from_currency,
                to_currency=to_currency,
            )

            if not data:
                return Response(
                    {"error": "Conversion failed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(data)

        except requests.RequestException as e:
            return Response(
                {"error": "Currency service error", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

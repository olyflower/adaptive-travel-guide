from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

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

        data = get_weather_data(lat=lat, lon=lon)

        if not data:
            return Response(
                {"error": "Weather service error"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(data)


class CurrencyExchangeView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        from_currency = request.query_params.get("from")
        to_currency = request.query_params.get("to", "UAH")

        if not from_currency:
            return Response(
                {"error": "Parameter 'from' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = get_currency_rate(
            from_currency=from_currency,
            to_currency=to_currency,
        )

        if not data:
            return Response(
                {"error": "Currency service error"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(data)

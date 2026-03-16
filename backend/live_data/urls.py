from django.urls import path
from .views import WeatherView, CurrencyExchangeView

urlpatterns = [
    path("weather/", WeatherView.as_view(), name="weather"),
    path("currency/", CurrencyExchangeView.as_view(), name="currency"),
]

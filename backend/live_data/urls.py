from django.urls import path
from . import views

urlpatterns = [
    path('weather/', views.weather, name='weather'),
	  path('currency/', views.currency, name='currency'),
]

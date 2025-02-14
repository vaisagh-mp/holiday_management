from django.urls import path
from . import views

urlpatterns = [
    path('holidays/', views.HolidayListAPIView.as_view(), name='holiday-list'),
    path('holidays/search/', views.HolidaySearchAPIView.as_view(), name='holiday-search'),
]
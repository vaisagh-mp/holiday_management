
import requests
from django.conf import settings
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HolidayListAPIView(APIView):
    def get(self, request, format=None):
        country = request.GET.get('country')
        year = request.GET.get('year')
        if not country or not year:
            return Response({"error": "country and year are required parameters."},
                            status=status.HTTP_400_BAD_REQUEST)

        cache_key = f"holidays_{country}_{year}"
        cached_data = cache.get(cache_key)
        if cached_data:
            data = cached_data
        else:
            api_key = settings.CALENDARIFIC_API_KEY
            url = "https://calendarific.com/api/v2/holidays"
            params = {
                'api_key': api_key,
                'country': country,
                'year': year,
            }
            try:
                response = requests.get(url, params=params)
                if response.status_code != 200:
                    return Response({"error": "Error fetching data from Calendarific API."},
                                    status=response.status_code)
                data = response.json()
                # Cache for 24 hours (86400 seconds)
                cache.set(cache_key, data, 86400)
            except Exception as e:
                return Response({"error": "Exception occurred while fetching data.", "details": str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(data)

class HolidaySearchAPIView(APIView):
    def get(self, request, format=None):
        name = request.GET.get('name')
        country = request.GET.get('country')
        year = request.GET.get('year')
        if not name or not country or not year:
            return Response({"error": "name, country, and year are required parameters."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Try to use cached holiday data if available
        cache_key = f"holidays_{country}_{year}"
        cached_data = cache.get(cache_key)
        if cached_data:
            data = cached_data
        else:
            api_key = settings.CALENDARIFIC_API_KEY
            url = "https://calendarific.com/api/v2/holidays"
            params = {
                'api_key': api_key,
                'country': country,
                'year': year,
            }
            try:
                response = requests.get(url, params=params)
                if response.status_code != 200:
                    return Response({"error": "Error fetching data from Calendarific API."},
                                    status=response.status_code)
                data = response.json()
                cache.set(cache_key, data, 86400)
            except Exception as e:
                return Response({"error": "Exception occurred while fetching data.", "details": str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Filter holidays by name (case-insensitive)
        holidays = data.get('response', {}).get('holidays', [])
        filtered_holidays = [holiday for holiday in holidays if name.lower() in holiday.get('name', '').lower()]

        return Response({"response": {"holidays": filtered_holidays}})

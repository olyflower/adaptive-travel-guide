from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import PreferenceCategory
from .serializers import PreferenceCategorySerializer, UserPreferenceSaveSerializer


class AllPreferencesListView(APIView):
    """
    Returns a complete list of all available preference categories and options
    Used to populate the preference selection UI for the user
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Fetches and serializes all PreferenceCategory objects"""

        categories = PreferenceCategory.objects.all()
        serializer = PreferenceCategorySerializer(categories, many=True)
        return Response(serializer.data)


class SaveUserPreferencesView(APIView):
    """
    Handles saving or updating the user's selected preferences
    Uses a custom serializer method to process the batch of preferences
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Validates input data and calls save_preferences for the current user"""

        serializer = UserPreferenceSaveSerializer(data=request.data)
        if serializer.is_valid():

            serializer.save_preferences(user=request.user)
            return Response(
                {"message": "Preferences saved successfully"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

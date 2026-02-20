from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import PreferenceCategory
from .serializers import PreferenceCategorySerializer, UserPreferenceSaveSerializer


class AllPreferencesListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = PreferenceCategory.objects.all()
        serializer = PreferenceCategorySerializer(categories, many=True)
        return Response(serializer.data)


class SaveUserPreferencesView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = UserPreferenceSaveSerializer(data=request.data)
        if serializer.is_valid():

            serializer.save_preferences(user=request.user)
            return Response(
                {"message": "Preferences saved successfully"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

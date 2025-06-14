from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Vehicle, Tutorial
from .serializers import TutorialSerializer, UserSerializer
from django.contrib.auth.models import User

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"
    permission_classes = [AllowAny]

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not user.check_password(old_password):
            return Response({"detail": "Old password is incorrect."}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password changed successfully."})

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"detail": "Account deleted."}, status=204)

class MakeListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        makes = Vehicle.objects.values_list('make', flat=True).distinct()
        return Response(sorted(set(makes)))

class ModelListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        make = request.query_params.get('make')
        if not make:
            return Response([])
        models = Vehicle.objects.filter(make=make).values_list('model', flat=True).distinct()
        return Response(sorted(set(models)))
    
class YearListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        make = request.query_params.get('make')
        model = request.query_params.get('model')
        if not make or not model:
            return Response([])
        years = Vehicle.objects.filter(make=make, model=model).values_list('year', flat=True).distinct()
        return Response(sorted(set(years)))

class TutorialListAPIView(generics.ListAPIView):
    serializer_class = TutorialSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Tutorial.objects.all()
        year = self.request.query_params.get('year')
        make = self.request.query_params.get('make')
        model = self.request.query_params.get('model')

        if year:
            queryset = queryset.filter(vehicle__year=year)
        if make:
            queryset = queryset.filter(vehicle__make__iexact=make)
        if model:
            queryset = queryset.filter(vehicle__model__iexact=model)

        return queryset

class TutorialDetailAPIView(generics.RetrieveAPIView):
    queryset = Tutorial.objects.all()
    serializer_class = TutorialSerializer
    permission_classes = [AllowAny]

class TutorialCreateAPIView(generics.CreateAPIView):
    serializer_class = TutorialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tutorial.objects.filter(author=user)

    def post(self, request, *args, **kwargs):
        print("REQUEST DATA:", request.data)
        print("FILES:", request.FILES)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user if request.user.is_authenticated else None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class TutorialDestroyAPIView(generics.DestroyAPIView):
    serializer_class = TutorialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tutorial.objects.filter(author=user)
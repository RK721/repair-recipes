from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Vehicle, Tutorial
from .serializers import TutorialSerializer

class MakeListView(APIView):
    def get(self, request):
        makes = Vehicle.objects.values_list('make', flat=True).distinct()
        return Response(sorted(set(makes)))

class ModelListView(APIView):
    def get(self, request):
        make = request.query_params.get('make')
        if not make:
            return Response([])
        models = Vehicle.objects.filter(make=make).values_list('model', flat=True).distinct()
        return Response(sorted(set(models)))
    
class YearListView(APIView):
    def get(self, request):
        make = request.query_params.get('make')
        model = request.query_params.get('model')
        if not make or not model:
            return Response([])
        years = Vehicle.objects.filter(make=make, model=model).values_list('year', flat=True).distinct()
        return Response(sorted(set(years)))

class TutorialListAPIView(generics.ListAPIView):
    serializer_class = TutorialSerializer

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

class TutorialCreateAPIView(generics.CreateAPIView):
    queryset = Tutorial.objects.all()
    serializer_class = TutorialSerializer

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
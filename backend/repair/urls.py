from django.urls import path
from .views import MakeListView, ModelListView, YearListView, TutorialListAPIView, TutorialDetailAPIView, TutorialCreateAPIView

urlpatterns = [
    path('vehicles/makes/', MakeListView.as_view()),
    path('vehicles/models/', ModelListView.as_view()),
    path('vehicles/years/', YearListView.as_view()),
    path('tutorials/', TutorialListAPIView.as_view()),
    path('tutorials/<int:pk>/', TutorialDetailAPIView.as_view()),
    path('tutorials/create/', TutorialCreateAPIView.as_view(), name='tutorial-create'),
]

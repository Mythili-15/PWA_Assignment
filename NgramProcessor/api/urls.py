from django.urls import path
from . import views

urlpatterns = [
    path('process-ngrams', views.process_ngrams, name='process_ngrams'),
]

from django.shortcuts import render
from .serializers import ReminderSerializer
from rest_framework import viewsets
from .models import Reminder

# Create your views here.


class ReminderView(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer
    queryset = Reminder.objects.all()

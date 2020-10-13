from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import viewsets
from rest_framework import permissions

from rdt.models import TestSession, TestResult
from rdt.serializers import TestSessionSerializer, TestResultSerializer


class FrontEndRenderer(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'index.html', context=None)


class TestSessionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows TestSession to be viewed or edited.
    """
    queryset = TestSession.objects.all()
    serializer_class = TestSessionSerializer
    permission_classes = [permissions.IsAuthenticated]


class TestResultViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows TestResult to be viewed or edited.
    """
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    permission_classes = [permissions.IsAuthenticated]

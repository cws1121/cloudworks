from rest_framework import viewsets
from rest_framework import permissions

from rdt.models import TestSession, TestResult, Media, TestSessionLog
from rdt.api.serializers import TestSessionSerializer, TestResultSerializer, MediaSerializer


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


class TestSessionLogsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows TestSessionLogs to be viewed or edited.
    """
    queryset = TestSessionLog.objects.all()
    serializer_class = TestResultSerializer
    permission_classes = [permissions.IsAuthenticated]


class MediaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Media to be viewed or edited.
    """
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]

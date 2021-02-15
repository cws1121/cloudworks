from rest_framework import routers

from rdt.api import viewsets


router = routers.DefaultRouter()
router.register(r'test_session', viewsets.TestSessionViewSet)
router.register(r'test_session_logs', viewsets.TestSessionLogsViewSet)
router.register(r'test_result', viewsets.TestResultViewSet)
router.register(r'media', viewsets.MediaViewSet)

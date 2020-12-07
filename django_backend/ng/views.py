import json
from datetime import datetime

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from account.serializers import UserSerializer
from domain.serializers import DomainSerializer
from rdt.models import TestSession, TestResult, Media
from rdt.api.serializers import TestSessionSerializer, TestResultSerializer, MediaSerializer


class Context(GenericAPIView):
    """
    Get user context - enterprise data, personal data, settings

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def post(self, request, *args, **kwargs):
        user_serializer = UserSerializer(request.user)
        domain_serializer = DomainSerializer(request.user.current_workspace)

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'user': user_serializer.data,
                'domain': domain_serializer.data,
            }
        })


class TestSessionView(GenericAPIView):
    """
    Get test sessions

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def get(self, request, *args, **kwargs):

        ts_records = TestSession.objects.filter(domain=request.user.current_workspace)
        ts_serializer = TestSessionSerializer(ts_records, many=True)

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'test_sessions': ts_serializer.data
            }
        })


class TestResultView(GenericAPIView):
    """
    Get test results

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        start = datetime.strptime(body.get('start_date'), "%Y-%m-%d").date()
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date()

        tr_records = TestResult.objects.filter(
            session__domain=request.user.current_workspace,
            time_read__gte=start,
            time_read__lte=end,
        )
        tr_serializer = TestResultSerializer(tr_records, many=True)

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'test_results': tr_serializer.data
            }
        })


class RdtImagesView(GenericAPIView):
    """
    Get rdt images

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        start = datetime.strptime(body.get('start_date'), "%Y-%m-%d").date()
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date()

        media_records = Media.objects.filter(
            session__domain=request.user.current_workspace,
            uploaded_at__gte=start,
            uploaded_at__lte=end,
        ).order_by('-uploaded_at')
        media_serializer = MediaSerializer(media_records, many=True)

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'rdt_images': media_serializer.data
            }
        })

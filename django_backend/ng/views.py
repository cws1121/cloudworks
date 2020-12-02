from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from account.serializers import UserSerializer
from domain.serializers import DomainSerializer
from rdt.models import TestSession
from rdt.api.serializers import TestSessionSerializer


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
    Get user context - enterprise data, personal data, settings

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

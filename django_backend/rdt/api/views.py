import json
from rest_framework.generics import GenericAPIView
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FileUploadParser

from rdt.api.serializers import IngestTestSessionSerializer, MediaSerializer, IngestTestSessionLogSerializer
from rdt.models import TestSession, Media
from domain.authentication import CollectorAuthentication


class WriteOnlyAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericAPIView):
    """
    A API view that provides `create` action.

    To use it set the `.serializer_class` attribute.
    """
    pass


class IngestTestSession(WriteOnlyAPIView):
    """
    Ingest Test Session API endpoint

    * Requires DSN authentication token.
    """
    authentication_classes = [CollectorAuthentication]
    serializer_class = IngestTestSessionSerializer

    def put(self, request, *args, **kwargs):
        request.data['raw_payload'] = json.loads(request.body)
        request.data['id'] = kwargs.get('guid')
        request.data['domain_id'] = request.user.id

        if TestSession.objects.filter(session_id=kwargs.get('guid')).exists():
            return Response('Test session with the same id already exists.', status=status.HTTP_409_CONFLICT)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response('Success!', status=status.HTTP_201_CREATED)


class IngestMedia(WriteOnlyAPIView):
    """
    Ingest Media API endpoint

    * Requires DSN authentication token.
    """
    authentication_classes = [CollectorAuthentication]
    serializer_class = MediaSerializer
    parser_classes = [FileUploadParser]

    def put(self, request, *args, **kwargs):
        request.data['session'] = kwargs.get('guid')
        request.data['external_id'] = kwargs.get('media_id')

        if Media.objects.filter(session_id=kwargs.get('guid'), external_id=kwargs.get('media_id')).exists():
            return Response('Media record with the same id already exists.', status=status.HTTP_409_CONFLICT)

        return self.create(request, *args, **kwargs)


class IngestLogs(WriteOnlyAPIView):
    """
    Ingest Logs API endpoint

    * Requires DSN authentication token.
    """
    authentication_classes = [CollectorAuthentication]
    serializer_class = IngestTestSessionLogSerializer

    def put(self, request, *args, **kwargs):
        payload = json.loads(request.body)
        for log_entry in payload['entries']:
            log_entry['session_id'] = kwargs.get('guid')
            serializer = self.get_serializer(data=log_entry)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
        return Response('Success!', status=status.HTTP_201_CREATED)

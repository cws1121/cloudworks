from rest_framework import serializers
from rdt.models import TestSession, TestResult, Media


class TestSessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
      model = TestSession
      fields = ('session_id',
                'status',
                'test_profile_id',
                'time_started')


class TestResultSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
      model = TestResult
      fields = ('session',
                'time_read',
                'raw_captured_image_file_path')


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
      model = Media
      fields = ('session',
                'name',
                'description',
                'external_id',
                'file')


class IngestTestSessionSerializer(serializers.Serializer):
    id = serializers.CharField(required=True, source='session_id')
    state = serializers.ChoiceField(choices=TestSession.STATUS_CHOICES, default=TestSession.COMPLETE)
    time_resolved = serializers.DateTimeField()
    time_started = serializers.DateTimeField()
    time_expired = serializers.DateTimeField()
    configuration = serializers.JSONField(required=False)
    result = serializers.JSONField(required=False)
    test_profile_id = serializers.CharField(required=True, max_length=200)
    raw_image_file_path = serializers.CharField(required=False, max_length=200)

    def create(self, validated_data):
        """
        Create and return a new `TestSession` instance, given the validated data.
        """
        ts_instance = TestSession.objects.create(
            status=validated_data.get('state'),
            session_id=validated_data.get('session_id'),
            test_profile_id=validated_data.get('test_profile_id'),
            time_resolved=validated_data.get('time_resolved'),
            time_started=validated_data.get('time_started'),
            time_expired=validated_data.get('time_expired')
        )

        result = validated_data.get('result')
        if result:
            TestResult.objects.create(
                session=ts_instance,
                classifier_results=result.get('results_classifier'),
                time_read=result.get('time_read'),
                raw_captured_image_file_path=result.get('raw_image_file_path'),
                results=result.get('results')
            )

        return ts_instance

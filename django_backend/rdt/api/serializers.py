from rest_framework import serializers
from rdt.models import TestSession, TestResult, Media


class TestSessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
      model = TestSession
      fields = ('session_id',
                'status',
                'test_profile_id',
                'raw_payload',
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
                'external_id',
                'file')


class ChoiceFieldNoValidation(serializers.ChoiceField):
    def to_internal_value(self, data):
        if data == '' and self.allow_blank:
            return ''

        try:
            return self.choice_strings_to_values[str(data)]
        except KeyError:
            return ''


class IngestTestSessionSerializer(serializers.Serializer):
    id = serializers.CharField(required=True, source='session_id')
    state = ChoiceFieldNoValidation(choices=TestSession.STATUS_CHOICES, default=TestSession.COMPLETE, allow_null=True)
    time_resolved = serializers.DateTimeField(required=False)
    time_started = serializers.DateTimeField(required=False)
    time_expired = serializers.DateTimeField(required=False)
    configuration = serializers.JSONField(required=False)
    result = serializers.JSONField(required=False)
    test_profile_id = serializers.CharField(required=False)
    raw_image_file_path = serializers.CharField(required=False)
    raw_payload = serializers.JSONField(required=False)

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
            time_expired=validated_data.get('time_expired'),
            raw_payload=validated_data.get('raw_payload')
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

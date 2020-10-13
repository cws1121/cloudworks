from rest_framework import serializers
from rdt.models import TestSession, TestResult


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

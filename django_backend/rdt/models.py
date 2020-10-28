from django.db import models
from jsonfield.fields import JSONField


class TestSession(models.Model):
    """
    The record of an individual diagnostic test session requested and run
    """

    COMPLETE = 'COMPLETE'
    RUNNING = 'RUNNING'
    BUILDING = 'BUILDING'
    QUEUED = 'QUEUED'
    STATUS_CHOICES = (
      (COMPLETE, 'COMPLETE'),
      (RUNNING, 'RUNNING'),
      (BUILDING, 'BUILDING'),
      (QUEUED, 'QUEUED')
    )
    session_id = models.CharField(max_length=200, primary_key=True)
    status = models.CharField(max_length=10, default=COMPLETE, choices=STATUS_CHOICES)
    test_profile_id = models.CharField(max_length=200, null=True)
    time_started = models.DateTimeField(null=True)
    time_resolved = models.DateTimeField(null=True)
    time_expired = models.DateTimeField(null=True)
    raw_payload = JSONField(default=dict, null=True)


class TestResult(models.Model):
    """
    The outcome and details of an individual diagnostic test
    """

    session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name='results')
    time_read = models.DateTimeField(null=True)
    raw_captured_image_file_path = models.CharField(max_length=200, null=True)
    # todo: storing results this way is not good for reporting and data analyzing ...
    results = JSONField(default=dict, null=True)
    classifier_results = JSONField(default=dict, null=True)


class Media(models.Model):
    """
    Files associated with test session
    """

    session = models.ForeignKey(TestSession, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True, null=True)
    original_file_name = models.CharField(max_length=255, blank=True, null=True)
    external_id = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

from django.db import models
from jsonfield.fields import JSONField


class TestSession(models.Model):
    """
    The record of an individual diagnostic test session requested and run
    """

    COMPLETE = 'COMPLETE'
    RUNNING = 'RUNNING'
    BUILDING = 'BUILDING'
    STATUS_CHOICES = (
      (COMPLETE, 'COMPLETE'),
      (RUNNING, 'RUNNING'),
      (BUILDING, 'BUILDING')
    )
    session_id = models.CharField(max_length=200, primary_key=True)
    status = models.CharField(max_length=10, default=COMPLETE, choices=STATUS_CHOICES)
    test_profile_id = models.CharField(max_length=200)
    time_started = models.DateTimeField()
    time_resolved = models.DateTimeField(null=True)
    time_expired = models.DateTimeField(null=True)


class TestResult(models.Model):
    """
    The outcome and details of an individual diagnostic test
    """

    session = models.ForeignKey(TestSession, on_delete=models.CASCADE)
    time_read = models.DateTimeField(null=True)
    raw_captured_image_file_path = models.CharField(max_length=200, null=True)
    # todo: storing results this way is not good for reporting and data analyzing ...
    results = JSONField(default=dict)
    classifier_results = JSONField(default=dict)

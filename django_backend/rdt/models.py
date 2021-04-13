from django.db import models
from jsonfield.fields import JSONField
from domain.models import Domain


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
    status = models.CharField(max_length=15, default=COMPLETE, choices=STATUS_CHOICES)
    test_profile_id = models.CharField(max_length=200, null=True)
    time_started = models.DateTimeField(null=True)
    time_resolved = models.DateTimeField(null=True)
    time_expired = models.DateTimeField(null=True)
    raw_payload = JSONField(default=dict, null=True)
    metrics = JSONField(default=dict, null=True, blank=True)
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name='sessions')


class TestSessionLog(models.Model):
    """
    Keeps track of ongoing event logs about important occurrences during a test evaluation session.
    """
    session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name='logs')
    timestamp = models.DateTimeField(null=True)
    tag = models.CharField(max_length=255, blank=True, null=True)
    message = models.CharField(max_length=255, blank=True, null=True)
    media_key = models.CharField(max_length=255, blank=True, null=True)
    json = JSONField(default=dict, null=True, blank=True)


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


    # @property
    # def positive(self):
    #     return TestResult.objects.filter(
    #         user__enterprise=self,
    #         is_sample=True
    #     ).count() > 0
    #
    # @property
    # def has_clasifier_result(self):
    #     return bool(self.classifier_results)
    #
    # @property
    # def has_user_result(self):
    #     return bool(self.results)
    #
    # @property
    # def has_both_results(self):
    #     return bool(self.results) and bool(self.classifier_results)
    #
    # @property
    # def concordance(self):
    #     if bool(self.results) and bool(self.classifier_results):
    #         if self.results == self.classifier_results:
    #             return True
    #     return False


class Media(models.Model):
    """
    Files associated with test session
    """

    session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name='media_list')
    name = models.CharField(max_length=255, blank=True, null=True)
    original_file_name = models.CharField(max_length=255, blank=True, null=True)
    external_id = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['session_id', 'external_id'], name='unique media record')
        ]

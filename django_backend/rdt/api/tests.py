import json
from mock import patch

from django.test import TestCase
from django.urls import reverse
from rdt.models import TestResult, TestSession, Media, TestSessionLog

from cw_core.test_utils.bootstrap import bootstrap_test_domain, bootstrap_test_session
from cw_core.test_utils.fake_media_factory import FakeMediaFactory

TEST_SESSION_PAYLOAD = {
    "result": {
        "raw_image_file_path": "testpath",
        "results_classifier": {},
        "time_read": "2020-10-16T16:25:34.467Z",
        "results": {
            "diag_one": "positive",
            "diag_two": "negative"
        }
    },
    "metrics": {
        "data": {
            "instructions_viewed": "true",
            "image_capture_attempts": "1"
        }
    },
    "test_profile_id": "test_id",
    "time_started": "2020-10-16T16:25:33.977Z",
    "time_expired": "2020-10-16T16:25:34.727Z",
    "configuration": {
        "flavor_text_two": "flavor_two",
        "classifier_mode": "PRE_POPULATE",
        "flags": {},
        "provision_mode_data": "test_id",
        "session_type": "ONE_PHASE",
        "provision_mode": "TEST_PROFILE",
        "flavor_text": "flavor_one"
    },
    "time_resolved": "2020-10-16T16:25:34.227Z",
    "state": "COMPLETE"
}


class TestRdtAPI(TestCase):

    def setUp(self):
        super(TestRdtAPI, self).setUp()
        self.domain, self.dsn_token = bootstrap_test_domain()

    def test_dsn_authentication(self):
        session_guid = '1122334455'
        fake_dsn_token = '11111111'
        url_args = {
            'dsn': fake_dsn_token,
            'guid': session_guid
        }
        response = self.client.put(reverse('ingest_test_session', kwargs=url_args), data=json.dumps({}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_ingest_test_session_method(self):
        session_guid = '1122334455'

        url_args = {
            'dsn': self.dsn_token,
            'guid': session_guid
        }

        response = self.client.put(reverse('ingest_test_session', kwargs=url_args),
                                   data=json.dumps(TEST_SESSION_PAYLOAD),
                                   content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertTrue(TestSession.objects.filter(session_id=session_guid).exists())
        self.assertTrue(TestResult.objects.filter(session=session_guid).exists())

        test_session = TestSession.objects.get(session_id=session_guid)
        test_result = TestResult.objects.get(session=test_session)

        self.assertEqual(TEST_SESSION_PAYLOAD, test_session.raw_payload)
        self.assertEqual(TEST_SESSION_PAYLOAD['result']['results'], test_result.results)

    def test_duplicated_ingest_test_session_requests(self):
        session_guid = '11111111'

        url_args = {
            'dsn': self.dsn_token,
            'guid': session_guid
        }

        response = self.client.put(reverse('ingest_test_session', kwargs=url_args),
                                   data=json.dumps(TEST_SESSION_PAYLOAD),
                                   content_type='application/json')

        self.assertEqual(response.status_code, 201)

        response = self.client.put(reverse('ingest_test_session', kwargs=url_args),
                                   data=json.dumps(TEST_SESSION_PAYLOAD),
                                   content_type='application/json')

        self.assertEqual(response.status_code, 409)

    @patch('storages.backends.s3boto3.S3Boto3Storage.save')
    def test_ingest_media_method(self, mock_save):
        mock_save.return_value = 'test.png'
        test_session = bootstrap_test_session()

        url_args = {
            'dsn': self.dsn_token,
            'guid': test_session.session_id,
            'media_id': 'cropped'
        }

        headers = {
            'HTTP_CONTENT_DISPOSITION': 'attachment; filename=test.png',
            'HTTP_CONTENT_TYPE': 'image/png'
        }

        response = self.client.put(reverse('ingest_media', kwargs=url_args), data=FakeMediaFactory.get_test_file(),
                                   **headers)

        self.assertEqual(response.status_code, 201)
        self.assertTrue(Media.objects.filter(session=test_session).exists())

    @patch('storages.backends.s3boto3.S3Boto3Storage.save')
    def test_duplicated_ingest_media_requests(self, mock_save):
        mock_save.return_value = 'test.png'
        test_session = bootstrap_test_session()

        url_args = {
            'dsn': self.dsn_token,
            'guid': test_session.session_id,
            'media_id': 'cropped'
        }

        headers = {
            'HTTP_CONTENT_DISPOSITION': 'attachment; filename=test.png',
            'HTTP_CONTENT_TYPE': 'image/png'
        }

        response = self.client.put(reverse('ingest_media', kwargs=url_args), data=FakeMediaFactory.get_test_file(),
                                   **headers)

        self.assertEqual(response.status_code, 201)

        response = self.client.put(reverse('ingest_media', kwargs=url_args), data=FakeMediaFactory.get_test_file(),
                                   **headers)

        self.assertEqual(response.status_code, 409)

    def test_ingest_test_session_logs_method(self):
        test_session = bootstrap_test_session()

        logs_payload = {
            "entries": [
                {
                    "timestamp" : "2021-01-25T16:12:21.563+00:00",
                    "tag": "user_action",
                    "message" : "Skipped instructions"
                }
                ,{
                    "timestamp" : "2021-01-25T16:12:24.563+00:00",
                    "tag": "user_action",
                    "message" : "User inititated timer override"
                }
                ,{
                    "timestamp" : "2021-01-25T16:12:28.563+00:00",
                    "tag": "classifier_dummy",
                    "message" : "Classifier returned error, json context attached",
                    "json" : {
                       "error_code": "4",
                       "arbitrary_json": "can be in this block"
                    },
                    "media_key" : "error_image_1"
                }

            ]
        }

        url_args = {
            'dsn': self.dsn_token,
            'guid': test_session.session_id
        }

        response = self.client.put(reverse('ingest_logs', kwargs=url_args),
                                   data=json.dumps(logs_payload),
                                   content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertTrue(TestSessionLog.objects.filter(session=test_session).exists())
        self.assertEqual(TestSessionLog.objects.filter(session=test_session).count(), 3)

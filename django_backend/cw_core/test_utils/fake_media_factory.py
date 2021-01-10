from io import BytesIO
from rest_framework.parsers import DataAndFiles


class FakeMediaFactory(object):

    @classmethod
    def get_test_file(cls):
        return BytesIO(b"fake image")

    @classmethod
    def fake_media_upload(cls, stream):
        return DataAndFiles({}, {'file': 'test.png'})

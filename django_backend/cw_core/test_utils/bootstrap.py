from domain.models import Domain, Token
from account.models import User
from rdt.models import TestSession


def bootstrap_test_domain():
    domain, created = Domain.objects.get_or_create(name='test')
    token, created = Token.objects.get_or_create(domain=domain)
    return domain, token


def bootstrap_user(obj):
    domain, dsn_token = bootstrap_test_domain()
    user = User.objects.create_user(username='testuser', password='12345', current_workspace=domain, is_active=True)
    login_credentials = {
        'username': 'testuser',
        'password': '12345'
    }

    obj.client.login(**login_credentials)
    return user


def bootstrap_test_session():
    domain, dsn_token = bootstrap_test_domain()
    test_session = TestSession.objects.create(domain=domain, session_id='1111111')
    return test_session

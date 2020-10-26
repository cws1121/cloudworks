from django.utils.translation import gettext_lazy as _

from rest_framework import authentication
from rest_framework import exceptions

from domain.models import Token


class CollectorAuthentication(authentication.BaseAuthentication):
    """
    Collector token based authentication.
    Write-Only authorization
    Token encodes both authorization and destination of data
    Authorization is associated with a domain
    Token has explicit permissions applied to it
    """

    keyword = 'dsn'

    def authenticate(self, request):
        url_params = request.parser_context['kwargs']

        if not url_params or self.keyword not in url_params:
            return None

        try:
            token = url_params[self.keyword]
            # todo: check whether it contains some invalid characters, decode token, extract permissions...
        except UnicodeError:
            msg = _('Invalid token. Token string should not contain invalid characters.')
            raise exceptions.AuthenticationFailed(msg)

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, key):
        try:
            token = Token.objects.select_related('domain').get(key=key)
        except Token.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('Invalid token.'))

        if not token.domain.is_active:
            raise exceptions.AuthenticationFailed(_('Domain inactive or deleted.'))

        return (token.domain, token)

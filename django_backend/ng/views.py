from __future__ import division
import json
from datetime import datetime, timedelta

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import TruncDate
from django.db.models import Count, Case, When, IntegerField, Q, F, Value

from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from account.serializers import UserSerializer
from domain.serializers import DomainSerializer
from rdt.models import TestSession, TestResult, Media
from rdt.api.serializers import TestSessionSerializer, TestResultSerializer, MediaSerializer


class Context(GenericAPIView):
    """
    Get user context - enterprise data, personal data, settings

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def post(self, request, *args, **kwargs):
        user_serializer = UserSerializer(request.user)
        domain_serializer = DomainSerializer(request.user.current_workspace)

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'user': user_serializer.data,
                'domain': domain_serializer.data,
            }
        })


class TestSessionView(GenericAPIView):
    """
    Get test sessions

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def get(self, request, *args, **kwargs):
        ts_records = TestSession.objects.filter(domain=request.user.current_workspace)
        ts_serializer = TestSessionSerializer(ts_records, many=True)

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'test_sessions': ts_serializer.data
            }
        })


class TestResultView(GenericAPIView):
    """
    Get test results

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        start = datetime.strptime(body.get('start_date'), "%Y-%m-%d").date()
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date()

        tr_records = TestResult.objects.filter(
            session__domain=request.user.current_workspace,
            time_read__gte=start,
            time_read__lte=end,
        )
        tr_serializer = TestResultSerializer(tr_records, many=True)

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'test_results': tr_serializer.data
            }
        })


class RdtImagesView(GenericAPIView):
    """
    Get rdt images

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        start = datetime.strptime(body.get('start_date'), "%Y-%m-%d").date()
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date()

        media_records = Media.objects.filter(
            session__domain=request.user.current_workspace,
            uploaded_at__gte=start,
            uploaded_at__lte=end,
        ).order_by('-uploaded_at')
        media_serializer = MediaSerializer(media_records, many=True)

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'rdt_images': media_serializer.data
            }
        })


class DashboardStatsView(GenericAPIView):
    """
    Get dashboard stats

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        start = datetime.strptime(body.get('start_date'), "%Y-%m-%d").date()
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date()

        day = start
        days = []
        while day <= end:
            days.append(day)
            day += timedelta(days=1)

        base_query = TestResult.objects.filter(
            session__domain=request.user.current_workspace,
            time_read__gte=start,
            time_read__lte=end
        )

        aggregated_data = base_query.annotate(
            day=TruncDate('time_read')
        ).values('day').annotate(
            discordance=Count(Case(
                When(~Q(results=F('classifier_results')) & ~Q(results__exact={}) & ~Q(classifier_results__exact={}), then=1),
                output_field=IntegerField(),
            )),
            total_readings=Count(Case(
                When(~Q(results__exact={}) | ~Q(classifier_results__exact={}), then=1),
                output_field=IntegerField(),
            )),
            results_valid=Count(Case(
                When(Q(session__time_resolved__lte=F('session__time_expired')),
                     then=1),
                output_field=IntegerField(),
            )),
            results_expired=Count(Case(
                When(Q(session__time_resolved__gt=F('session__time_expired')),
                     then=1),
                output_field=IntegerField(),
            )),
            positive_readings=Count(Case(
                When(Q(results__icontains='pos') | Q(classifier_results__icontains='pos'),
                     then=1),
                output_field=IntegerField(),
            ))
        )

        total_readings_data={}
        discordance_data = {}
        results_valid_data={}
        results_expired_data={}
        positive_readings_data = {}
        for row in aggregated_data:
            total_readings_data[row['day']] = row['total_readings']
            discordance_data[row['day']] = row['discordance']
            results_valid_data[row['day']] = row['results_valid']
            results_expired_data[row['day']] = row['results_expired']
            positive_readings_data[row['day']] = row['positive_readings']

        readings_chart_data = {
            "days": [d.isoformat() for d in days],
            "total_readings": [total_readings_data.get(d,0) for d in days],
            "disagreed_readings": [discordance_data.get(d,0) for d in days],
        }

        validity_chart_data = {
            "days": [d.isoformat() for d in days],
            "results_valid": [results_valid_data.get(d,0)/total_readings_data.get(d,1)*100 for d in days],
            "results_expired": [results_expired_data.get(d,0)/total_readings_data.get(d,1)*100 for d in days],
        }

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'readings_chart_data': readings_chart_data,
                'validity_chart_data': validity_chart_data,
                'total_readings': base_query.count(),
                'concordance': round(100 - sum(discordance_data.values())/base_query.count() * 100, 2),
                'positive_readings': sum(positive_readings_data.values())
            }
        })

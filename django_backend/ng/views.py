from __future__ import division
import json
import xlwt
from datetime import datetime, timedelta

from django.core.exceptions import ValidationError
from django.http.response import HttpResponse
from django.utils.encoding import smart_str
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from django.db.models.functions import TruncDate
from django.db.models import Count, Case, When, IntegerField, Q, F, Value, Sum

from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from account.serializers import UserSerializer
from domain.serializers import DomainSerializer
from rdt.models import TestSession, TestResult, Media, Domain
from rdt.api.serializers import TestSessionSerializer, TestResultSerializer, ExtendedMediaSerializer


class Context(GenericAPIView):
    """
    Get user context - enterprise data, personal data, settings

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]

    def post(self, request, *args, **kwargs):
        user_serializer = UserSerializer(request.user)
        domain_serializer = DomainSerializer(request.user.current_workspace)
        current_domain = available_domains = domain_serializer.data

        if request.user.is_staff:
            available_domains = Domain.objects.all()
            available_domains = DomainSerializer(available_domains, many=True).data

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'user': user_serializer.data,
                'current_domain': current_domain,
                'available_domains': available_domains,
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
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date() + timedelta(days=1)

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
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date() + timedelta(days=1)

        media_records = Media.objects.filter(
            session__domain=request.user.current_workspace,
            uploaded_at__gte=start,
            uploaded_at__lte=end,
        ).order_by('-uploaded_at')
        media_serializer = ExtendedMediaSerializer(media_records, many=True)

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
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date() + timedelta(days=1)

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
                When(Q(time_read__lte=F('session__time_expired')) & Q(time_read__gte=F('session__time_resolved')),
                     then=1),
                output_field=IntegerField(),
            )),
            captured_too_late=Count(Case(
                When(Q(time_read__gt=F('session__time_expired')),
                     then=1),
                output_field=IntegerField(),
            )),
            captured_too_early=Count(Case(
                When(Q(time_read__lt=F('session__time_resolved')),
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
        captured_too_late_data={}
        captured_too_early_data = {}
        positive_readings_data = {}
        for row in aggregated_data:
            total_readings_data[row['day']] = row['total_readings']
            discordance_data[row['day']] = row['discordance']
            results_valid_data[row['day']] = row['results_valid']
            captured_too_late_data[row['day']] = row['captured_too_late']
            captured_too_early_data[row['day']] = row['captured_too_early']
            positive_readings_data[row['day']] = row['positive_readings']

        readings_chart_data = {
            "days": [d.isoformat() for d in days],
            "total_readings": [total_readings_data.get(d,0) for d in days],
            "disagreed_readings": [discordance_data.get(d,0) for d in days],
        }

        validity_chart_data = {
            "days": [d.isoformat() for d in days],
            "results_valid": [results_valid_data.get(d,0) for d in days],
            "captured_too_early": [captured_too_early_data.get(d,0) for d in days],
            "captured_too_late": [captured_too_late_data.get(d, 0) for d in days],
        }

        total_readings = base_query.count()
        agreement = 'N/A'
        positivity_rate = 'N/A'
        if total_readings != 0:
            agreement = str(round(100 - sum(discordance_data.values())/total_readings * 100, 2)) + '%'
            positivity_rate = str(round(100 - sum(positive_readings_data.values())/total_readings * 100, 2)) + '%'

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'readings_chart_data': readings_chart_data,
                'validity_chart_data': validity_chart_data,
                'total_readings': total_readings,
                'agreement': agreement,
                'positive_readings': sum(positive_readings_data.values()),
                'positivity_rate': positivity_rate
            }
        })


class GlobalStatsView(GenericAPIView):
    """
    Get global stats

    * Requires JWT authentication token.
    """
    authentication_classes = [JSONWebTokenAuthentication]
    permission_classes = (IsAdminUser,)

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        start = datetime.strptime(body.get('start_date'), "%Y-%m-%d").date()
        end = datetime.strptime(body.get('end_date'), "%Y-%m-%d").date() + timedelta(days=1)

        day = start
        days = []
        while day <= end:
            days.append(day)
            day += timedelta(days=1)

        base_query = TestResult.objects.filter(
            time_read__gte=start,
            time_read__lte=end
        )

        aggregated_data = base_query.annotate(
            day=TruncDate('time_read')
        ).values('session__test_profile_id','day').annotate(
            total_readings=Count(Case(
                When(~Q(results__exact={}) | ~Q(classifier_results__exact={}), then=1),
                output_field=IntegerField(),
            )),
            positive_readings=Count(Case(
                When(Q(results__icontains='pos') | Q(classifier_results__icontains='pos'),
                     then=1),
                output_field=IntegerField(),
            ))
        )

        test_profiles = set()
        readings_per_profile_data={}
        positive_readings_per_profile_data = {}
        for row in aggregated_data:
            test_profiles.add(row['session__test_profile_id'])

        for profile in test_profiles:
            total_readings_data = {}
            positive_readings_data = {}
            for row in aggregated_data:
                if row['session__test_profile_id'] == profile:
                    total_readings_data[row['day']] = row['total_readings']
                    positive_readings_data[row['day']] = row['positive_readings']
            readings_per_profile_data[profile] = total_readings_data
            positive_readings_per_profile_data[profile] = positive_readings_data

        readings_chart_data = {
            "days": [d.isoformat() for d in days]
        }

        for t_profile in readings_per_profile_data:
            readings_chart_data[t_profile] = [readings_per_profile_data[t_profile].get(d,0) for d in days]

        total_readings = base_query.count()
        positive_readings = sum(sum(item.values()) for item in positive_readings_per_profile_data.values())

        total_readings_per_profile_sum = {}
        for item in readings_per_profile_data:
            total_readings_per_profile_sum[item] = sum(readings_per_profile_data[item].values())

        positive_readings_per_profile_sum = {}
        for item in positive_readings_per_profile_data:
            positive_readings_per_profile_sum[item] = sum(positive_readings_per_profile_data[item].values())

        aggregated_by_domain = base_query.annotate(domain_name=F('session__domain__name')).values('domain_name').annotate(
            total_readings=Count(Case(
                When(~Q(results__exact={}) | ~Q(classifier_results__exact={}), then=1),
                output_field=IntegerField(),
            )),
            positive_readings=Count(Case(
                When(Q(results__icontains='pos') | Q(classifier_results__icontains='pos'),
                     then=1),
                output_field=IntegerField(),
            ))
        )

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'data': {
                'test_profiles': test_profiles,
                'readings_chart_data': readings_chart_data,
                'total_readings': total_readings,
                'positive_readings': positive_readings,
                'positivity_rate': round(positive_readings / total_readings * 100, 2) if total_readings>0 else 0,
                'total_readings_per_profile_sum': total_readings_per_profile_sum,
                'positive_readings_per_profile_sum': positive_readings_per_profile_sum,
                'positivity_rate_by_domain': aggregated_by_domain,
            }
        })


class SwitchDomain(GenericAPIView):
    """
    Switch admin user domain

    * Requires JWT authentication token and staff role.
    """
    authentication_classes = [JSONWebTokenAuthentication]
    permission_classes = (IsAdminUser,)

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        domain_id = body.get('domain_id')
        domain = Domain.objects.filter(id=domain_id).get()
        user = request.user
        user.current_workspace = domain
        user.save()

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK
        })


class ExportCaseData(GenericAPIView):
    """
    Export Case Data to XLS

    * Requires JWT authentication token.
    """

    def get(self, request, *args, **kwargs):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        jwt_token = request.GET.get('jwt')

        try:
            data = {'token': jwt_token}
            valid_data = VerifyJSONWebTokenSerializer().validate(data)
            user = valid_data['user']
            request.user = user
        except ValidationError as v:
            print("validation error", v)
            return

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="test_results.xls"'

        test_results = TestResult.objects.filter(
            session__domain=request.user.current_workspace,
            time_read__gte=start_date,
            time_read__lte=end_date
        ).order_by('-time_read')

        tr_records = TestResultSerializer(test_results, many=True).data
        wb = xlwt.Workbook(encoding='utf-8')

        ws = wb.add_sheet('TestResults')
        row_num = 0

        font_style = xlwt.XFStyle()
        font_style.font.bold = True

        columns = ['Time Read', 'Results', 'Classifier Eesults', 'Session Record']

        for col_num in range(len(columns)):
            ws.write(row_num, col_num, columns[col_num], font_style)

        keys = ['time_read', 'results', 'classifier_results', 'session']
        for row in tr_records:
            row = [row[key_item] for key_item in keys]
            row_num += 1
            for col_num in range(len(row)):
                ws.write(row_num, col_num, smart_str(row[col_num]), font_style)
            ws.write(row_num, len(row), "UTC", font_style)

        wb.save(response)
        return response

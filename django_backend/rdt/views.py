from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.views.generic import TemplateView

from rdt.models import TestSession, TestResult
from rdt.serializers import TestSessionSerializer, TestResultSerializer


class FrontEndRenderer(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'index.html', context=None)


@csrf_exempt
def testSessionsApi(request, id=0):
    if request.method=='GET':
        test_sessions = TestSession.objects.all()
        test_sessions_serializer = TestSessionSerializer(test_sessions, many=True)
        return JsonResponse(test_sessions_serializer.data, safe=False)
    elif request.method=='POST':
        session_data = JSONParser().parse(request)
        test_sessions_serializer = TestSessionSerializer(data=session_data)
        if test_sessions_serializer.is_valid():
            test_sessions_serializer.save()
            return JsonResponse('Successfully saved!', safe=False)
        else:
            return JsonResponse('Failed to add.', safe=False)

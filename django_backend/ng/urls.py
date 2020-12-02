from django.conf.urls import url, include
from ng import views

urlpatterns = [
    url(r'^context/', views.Context.as_view()),
    url(r'^test_session_list/', views.TestSessionView.as_view()),
]

from django.conf.urls import url, include
from ng import views

urlpatterns = [
    url(r'^context/', views.Context.as_view()),
    url(r'^test_session_list/', views.TestSessionView.as_view()),
    url(r'^test_result_list/', views.TestResultView.as_view()),
    url(r'^rdt_images_list/', views.RdtImagesView.as_view()),
    url(r'^dashboard_stats/', views.DashboardStatsView.as_view()),
    url(r'^global_stats/', views.GlobalStatsView.as_view()),
    url(r'^switch_domain/', views.SwitchDomain.as_view()),
]

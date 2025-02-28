from django.urls import path
from django.contrib.auth import views as auth_views
from . import views


urlpatterns =[
    path('allowance/', views.AllowanceListCreate.as_view(), name='allowance-list'),
    path('allowance/delete/<int:pk>/', views.AllowanceDelete.as_view(), name='delete-allowance'),
    path('allowances/update/<int:id>/', views.AllowanceUpdate.as_view(), name='allowance-update'),
]
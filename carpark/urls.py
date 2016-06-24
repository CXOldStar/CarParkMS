# -*- coding: utf-8 -*-
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='home'),
    url(r'^manage$', views.manage, name='manage'),
    url(r'^parking-edit$', views.parking_edit, name='parking_edit'),
    url(r'^parking-delete$', views.parking_delete, name='parking_delete'),
]
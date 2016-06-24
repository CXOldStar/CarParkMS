from django.shortcuts import render
from .models import Parking
import datetime
from django.utils import timezone
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import logging
# TODO: 添加日志

# Create your views here.
def index(request):
    parking_list = Parking.objects.all()

    return render(request, 'carpark/index.html', {'parking_list': parking_list})


def manage(request):
    parking_list = Parking.objects.all()

    return render(request, 'carpark/manage.html', {'parking_list': parking_list})


@csrf_exempt
@require_http_methods(['POST',])
def parking_edit(request):
    data = request.POST
    if data.get('parking_id'):
        # update
        parking = Parking.objects.get(id=data.get('parking_id'))
        if parking:
            try:
                parking.name = data['name']
                parking.eui = data['eui']
                parking.mac = data['mac']
                parking.save()
                logging.error('Alter paring info success')
                return HttpResponse(json.dumps({'message': '修改成功', 'success': True,
                        'data': {'parking': {'id': parking.id, 'eui': parking.eui, 'mac': parking.mac,
                                             'status': parking.status}}}), content_type='application/json')
            except KeyError as e:
                logging.error(e)
                return HttpResponse(json.dumps({'message': '数据错误', 'success': True, 'data': None}), content_type='application/json')
    else:
        # new parking
        parking = Parking()
        try:
            parking.name = data['name']
            parking.eui = data['eui']
            parking.mac = data['mac']
            parking.save()
            logging.info('Add new parking  success')
            return HttpResponse(json.dumps({'message': '添加成功', 'success': True,
                            'data': {'parking': {'id': parking.id, 'eui': parking.eui, 'mac': parking.mac,
                                    'status': parking.status}}}), content_type='application/json')
        except KeyError as e:
            logging.error(e)
            return HttpResponse(json.dumps({'message': '数据错误', 'success': True, 'data': None}), content_type='application/json')


@csrf_exempt
@require_http_methods(['POST',])
def parking_delete(request):
    parking = Parking.objects.get(id=request.POST.get('parking_id'))
    if parking:
        parking.delete()
        return HttpResponse(json.dumps({'message': '删除成功', 'success': True, 'data': None}),
                            content_type='application/json')
    else:
        HttpResponse(json.dumps({'message': '车位不存在', 'success': False, 'data': None}))
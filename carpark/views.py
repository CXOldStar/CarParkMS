from django.shortcuts import render
from .models import Parking
# Create your views here.
def index(request):
    parking_list = Parking.objects.all()
    return render(request, 'carpark/index.html', {'parking_list': parking_list})

def manage(request):
    return render(request, 'carpark/manage.html')
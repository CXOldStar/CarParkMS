from django.db import models
from django.utils.translation import ugettext, ugettext_lazy as _
# Create your models here.

PARKING_STATUS_EMPTY = 1
PARKING_STATUS_USING = 2
PARKING_STATUS_REPAIR = 3
PARKING_STATUS_STOP_USING = 4
PARKING_STATUS_CHOICES = (
    (PARKING_STATUS_EMPTY, _('Empty')),
    (PARKING_STATUS_USING, _('Using')),
    (PARKING_STATUS_REPAIR, _('Repair')),
    (PARKING_STATUS_STOP_USING, _('Stop Using')),
)


class Parking(models.Model):
    name = models.CharField(max_length=64)
    status = models.IntegerField(_('Status'),
                                 choices=PARKING_STATUS_CHOICES, default=PARKING_STATUS_EMPTY
                                 )
    eui = models.CharField(max_length=32, unique=True)
    mac = models.CharField(max_length=32, unique=True)
    last_park_time = models.DateTimeField(null=True)


class ParkingRecord(models.Model):
    parking = models.ForeignKey(Parking, on_delete=models.CASCADE)
    enter_time = models.DateTimeField()
    exit_time = models.DateTimeField()
    temperature = models.FloatField()



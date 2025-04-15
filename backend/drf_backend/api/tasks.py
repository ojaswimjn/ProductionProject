# api/tasks.py
from .models import PickupRequest
from .utils import notify_user
from datetime import date

def send_pickup_day_reminders():
    today = date.today()
    pickups = PickupRequest.objects.filter(request_date=today)

    for pickup in pickups:
        user = pickup.user_id  # or pickup.user_id_id if you're using a FK
        notify_user(user, "Waste Pickup Reminder", "Your pickup is scheduled for today.")

import logging
from django_cron import CronJobBase, Schedule
from datetime import datetime
from .tasks import send_pickup_day_reminders  # Ensure this import is correct

logger = logging.getLogger(__name__)

class PickupDayReminderCronJob(CronJobBase):
    RUN_AT_TIMES = ['08:00']
    schedule = Schedule(run_at_times=RUN_AT_TIMES)
    code = 'api.pickup_day_reminder'

    def do(self):
        logger.info(f"Pickup reminder cron job is running at {datetime.now()}")
        if datetime.today().weekday() in [1, 4]:  # Tuesday = 1, Friday = 4
            send_pickup_day_reminders()
        logger.info(f"Pickup reminder cron job finished at {datetime.now()}")



# class PickupDayReminderCronJob(CronJobBase):
#     RUN_AT_TIMES = ['11:40']  # Run every morning at 8 AM
#     schedule = Schedule(run_at_times=RUN_AT_TIMES)
#     code = 'api.pickup_day_reminder'

#     # def do(self):
#     #     # Only run on Tuesday or Friday
#     #     if datetime.today().weekday() in [1, 4]:  # Tuesday = 1, Friday = 4
#     #         send_pickup_day_reminders()

#     def do(self):
#         # Add logging here to verify if the job runs
#         print(f"Pickup reminder cron job is running at {datetime.now()}")
#         send_pickup_day_reminders()

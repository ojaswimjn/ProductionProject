@echo off
cd C:\project\backend\drf_backend
venv\Scripts\python.exe manage.py runcrons >> pickup_log.txt 2>&1

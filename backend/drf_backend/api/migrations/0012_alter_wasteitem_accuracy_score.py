# Generated by Django 5.1.6 on 2025-03-04 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_wasteitem_accuracy_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wasteitem',
            name='accuracy_score',
            field=models.FloatField(blank=True, null=True),
        ),
    ]

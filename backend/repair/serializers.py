from rest_framework import serializers
from .models import Vehicle, Tool, Part, Step, Tutorial

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = '__all__'

class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = '__all__'

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['step_number', 'instruction', 'image']

class TutorialSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer()
    tools = ToolSerializer(many=True)
    parts = PartSerializer(many=True)
    steps = StepSerializer(many=True)

    class Meta:
        model = Tutorial
        fields = '__all__'

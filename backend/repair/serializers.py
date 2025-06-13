from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Vehicle, Tool, Part, Step, Tutorial

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

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
        fields = ['step_number', 'instruction']

class TutorialSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer()
    tools = ToolSerializer(many=True)
    parts = PartSerializer(many=True)
    steps = StepSerializer(many=True)

    class Meta:
        model = Tutorial
        fields = '__all__'
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        vehicle_data = validated_data.pop('vehicle')
        tools_data = validated_data.pop('tools', [])
        parts_data = validated_data.pop('parts', [])
        steps_data = validated_data.pop('steps', [])

        vehicle, created = Vehicle.objects.get_or_create(**vehicle_data)
        tutorial = Tutorial.objects.create(vehicle=vehicle, **validated_data)

        for tool_data in tools_data:
            tool, _ = Tool.objects.get_or_create(**tool_data)
            tutorial.tools.add(tool)

        for part_data in parts_data:
            part, _ = Part.objects.get_or_create(**part_data)
            tutorial.parts.add(part)

        for step_data in steps_data:
            Step.objects.create(tutorial=tutorial, **step_data)

        return tutorial

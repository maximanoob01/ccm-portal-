from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register_faculty(request):
    name = request.data.get('name', '').strip()
    department = request.data.get('department', '').strip()
    password = request.data.get('password', '')

    if not name or not department or not password:
        return Response({'error': 'All fields are required.'}, status=400)

    # Generate username from name
    username = name.lower().replace(' ', '.')
    base = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base}{counter}"
        counter += 1

    parts = name.strip().split(' ')
    first = parts[0]
    last = ' '.join(parts[1:]) if len(parts) > 1 else ''

    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first,
        last_name=last,
        role='faculty',
        department=department,
    )

    return Response({
        'message': 'Account created successfully!',
        'username': username,
    }, status=201)
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'full_name': user.get_full_name() or user.username,
        'role': user.role,
        'department': user.department,
    })
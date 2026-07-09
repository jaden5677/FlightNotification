from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user


from.index import index_views

from Backend.controllers import login

auth_views = Blueprint('auth_views', __name__)

'''
API Routes
'''

@auth_views.route('/api/login', methods=['POST'])
def user_login_api():
  data = request.json or {}
  token = login(data.get('email'), data.get('password'))
  if not token:
    return jsonify(message='bad email or password given'), 401
  response = jsonify(access_token=token) 
  return response


@auth_views.route('/api/identify', methods=['GET'])
@jwt_required()
def identify_user():
    return jsonify(current_user.get_json())

@auth_views.route('/api/logout', methods=['GET'])
def logout_api():
    response = jsonify(message="Logged Out!")
    return response
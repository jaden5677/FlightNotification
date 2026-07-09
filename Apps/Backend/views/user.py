from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user as jwt_current_user

from .index import index_views
from Backend.models.accttype import AccountTypeEnum
from Backend.controllers import (
    create_user,
    get_all_users,
    get_all_users_json,
    jwt_required
)

user_views = Blueprint('user_views', __name__)


@user_views.route('/api/users', methods=['GET'])
@jwt_required()
def get_users_action():
    users = get_all_users_json()
    return jsonify(users)

@user_views.route('/api/users', methods=['POST'])
@jwt_required()
def create_user_endpoint():
    data = request.json
    user = create_user(
        UID = data['UID'],
        fName = data['fName'],
        lName = data['lName'],
        email = data['email'],
        passportIDN = data['passportIDN'],
        password = data['password'],
        nationality = data['nationality'],
        DOB = data['DOB'],
        gender = data['gender'],
        cNumber = data['cNumber'],
        aType = AccountTypeEnum[data['aType']],
        specialR = data['specialR']
        )
    return jsonify({'message': f"user {user.email} created with id {user.usersID}"})


from flask import Blueprint, redirect, render_template, request, send_from_directory, jsonify
from Backend.controllers import create_user, initialize

index_views = Blueprint('index_views', __name__)

@index_views.route('/init', methods=['GET'])
def init():
    initialize()
    return jsonify(message='db initialized!')

@index_views.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status':'healthy'})
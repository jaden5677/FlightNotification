from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user as jwt_current_user

from Backend.controllers.flights import (
    createflight,
    get_all_flights,
    getflight_by_number
)
from Backend.controllers.notification import(
    list_notification_by_flight,
    create_notification
)

flight_views = Blueprint('flight_views', __name__)

@flight_views.route('api/flights', methods=['Get'])
@jwt_required()
def get_flights_action():
    flights = get_all_flights()
    return jsonify(flights)

flight_views.route('api/flights/<flight_number>', methods=['Get'])
@jwt_required()
def get_flight_by_flightnumber_action(flightnumber):
    flight = getflight_by_number(flightnumber)
    if flight is None:
        return jsonify(message=f"Flight with flight number {flightnumber} not found"), 404
    return jsonify(flight)

flight_views.route('api/flights', methods=['POST'])
jwt_required()
def create_flight_action():
    data = request.json
    flight = createflight(
        flight_number= data['flight_number'],
        departure_airport=data['departure_airport'],
        arrival_airport=data['arrival_airport'],
        departure_time=data['departure_time'],
        arrival_time=data['arrival_time'],
        aircraftype=data['aircraftype']
    )
    return jsonify(flight), 201

flight_views.route('api/flights/<flight_number>/notifications'), methods = ['Get']
@jwt_required()
def get_notifications_by_flight_action(flight_number):
    flight = getflight_by_number(flight_number)
    if flight is None:
        return jsonify(message=f"flight with flight number {flight_number} not found"), 404
    notifications = list_notification_by_flight(flight_number)
    return jsonify(notifications)

flight_views.route('/api/flights/<flight_number>/notify'), methods = ['POST']
@jwt_required()
def create_notification_for_flight_action(flight_number):
    flight = getflight_by_number(flight_number)
    if flight is None:
        return jsonify(message=f"flight with flight number {flight_number} not found"), 404
    data = request.json
    notification = create_notification(
      flight_number=flight_number,
      notif_type = int(data['notif_type']),
      message = data['message'],
      gate = data['gate'],
      created_by = data['created_by']
    )
    return jsonify(notification), 201
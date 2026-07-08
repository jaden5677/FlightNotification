from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user as jwt_current_user

from Backend.controllers.flights import (
    createflight,
    get_all_flights,
    getflight_by_number,
    get_all_json_flights
)
from Backend.controllers.notification import(
    list_notification_by_flight,
    create_notification,
    list_json_notifications_by_flight_id
)
from Backend.models.notiftype import *


flight_views = Blueprint('flight_views', __name__)

@flight_views.route('/api/flights', methods=['Get'])
@jwt_required()
def get_flights_action():
    flights = get_all_json_flights()
    if flights is not None:
        return flights, 201
    return jsonify(message=f"No flights found"), 404

@flight_views.route('/api/flights/<flight_number>', methods=['Get'])
@jwt_required()
def get_flight_by_flightnumber_action(flightnumber):
    flight = getflight_by_number(flightnumber)
    if flight is None:
        return jsonify(message=f"Flight with flight number {flightnumber} not found"), 404
    return flight.get_json(), 201

@flight_views.route('/api/flights', methods=['POST'])
@jwt_required()
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
    return flight.get_json(), 201

@flight_views.route('/api/flights/<flight_number>/notifications', methods = ['Get'])
@jwt_required()
def get_notifications_by_flight_action(flight_number):
    flight = getflight_by_number(flight_number)
    if flight is None:
        return jsonify(message=f"flight with flight number {flight_number} not found"), 404
    
    return list_json_notifications_by_flight_id(flight_number)

@flight_views.route('/api/flights/<flight_number>/notify', methods = ['POST'])
@jwt_required()
def create_notification_for_flight_action(flight_number):
    flight = getflight_by_number(flight_number)
    if flight is None:
        return jsonify(message=f"flight with flight number {flight_number} not found"), 404
    data = request.json
    notification = create_notification(
      flight_id=flight_number,
      notif_type = NotifType[int(data['notif_type']).upper()],
      message = data['message'],
      gate = data['gate'],
      created_by = data['created_by']
    )
    return notification.get_json(), 201
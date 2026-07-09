// Mirrors Flights.get_json() from Apps/Backend/models/flights.py (branch FN-1).
// Note: the backend's JSON key really is "aircrafttype" (double t), kept as-is
// here so a later swap to the real HTTP service needs no field remapping.
export interface FlightDto {
    id: number;
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: Date;
    arrival_time: Date;
    aircrafttype: string;
}

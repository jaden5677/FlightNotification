// Mirrors Passenger.get_json() from Apps/Backend/models/passenger.py.
// Each row joins the passenger name with its flight's origin/destination/times.
export interface PassengerRow {
    id: number;
    name: string;
    origin: string;
    destination: string;
    arrival: string;
    departure: string;
    flight_number: string;
}

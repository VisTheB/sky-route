import { FareConditions } from './fare-conditions.model';

export type Passenger = {
  passenger_id: string;
  passenger_name: string;
};

export type CreateBookingRequest = {
  flight_ids: number[];
  fare_conditions: FareConditions;
  passengers: Passenger[];
};

export type BookingSegment = {
  flight_id: number;
  flight_no: string;
  departure_airport: string;
  arrival_airport: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  fare_conditions: string;
  price: number;
  has_b_pass: boolean;
};

export type Ticket = {
  ticket_no: string;
  passenger_id: string;
  passenger_name: string;
  segments: BookingSegment[];
};

export type Booking = {
  book_ref: string;
  book_date: string;
  total_amount: number;
  tickets: Ticket[];
};

export type BookingSummary = {
  book_ref: string;
  book_date: string;
  total_amount: number;
  departure_airport: string;
  departure_city: string;
  arrival_airport: string;
  arrival_city: string;
  fare_conditions: string;
  passengers_count: number;
};

import { FareConditions } from './fare-conditions.model';

export type AirportRef = {
  code: string;
  city: string;
};

export type RouteSegment = {
  flight_id: number;
  route_no: string;
  departure_airport: AirportRef;
  arrival_airport: AirportRef;
  scheduled_departure: string;
  scheduled_arrival: string;
  duration_minutes: number;
  fare_conditions: FareConditions;
  price: number;
};

export type RouteOption = {
  connections: number;
  total_duration_minutes: number;
  total_price: number;
  departure_time: string;
  arrival_time: string;
  segments: RouteSegment[];
};

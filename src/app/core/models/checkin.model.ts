import { FareConditions } from './fare-conditions.model';

export const CHECK_IN_OPENS_HOURS_BEFORE = 24;
export const CHECK_IN_CLOSES_MINUTES_BEFORE = 60;

export type CheckInStatus = 'not-yet' | 'available' | 'closed' | 'unknown';

export type AvailableSeat = {
  seat_no: string;
  fare_conditions: FareConditions;
  available: boolean;
};

export type CheckInRequest = {
  ticket_no: string;
  flight_id: number;
  seat_no?: string;
};

export type BoardingPass = {
  ticket_no: string;
  flight_id: number;
  seat_no: string;
  fare_conditions: FareConditions;
};

export type CheckInDialogData = {
  ticket_no: string;
  flight_id: number;
  flight_no: string;
  fare_conditions: FareConditions;
  mode: Mode;
};

export type Mode = 'choosing' | 'pass';

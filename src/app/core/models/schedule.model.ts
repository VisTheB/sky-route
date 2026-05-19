export type FlightStatus =
  | 'Scheduled'
  | 'On Time'
  | 'Delayed'
  | 'Departed'
  | 'Arrived'
  | 'Cancelled';

export type OutboundFlightEntry = {
  route_no: string;
  destination_code: string;
  destination_city: string;
  departure_local: string;
  status: FlightStatus;
};

export type InboundFlightEntry = {
  route_no: string;
  origin_code: string;
  origin_city: string;
  arrival_local: string;
  status: FlightStatus;
};

export type PaginationQuery = {
  limit?: number;
  offset?: number;
  from?: string;
  to?: string;
};

export type PaginatedOutbound = {
  items: OutboundFlightEntry[];
  total: number;
  limit: number;
  offset: number;
};

export type PaginatedInbound = {
  items: InboundFlightEntry[];
  total: number;
  limit: number;
  offset: number;
};

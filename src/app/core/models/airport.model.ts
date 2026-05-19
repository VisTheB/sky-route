export type ScheduleTab = 'outbound' | 'inbound';

export type AirportCityRef = {
  airport_code: string;
  airport_name: string;
};

export type CityAirports = {
  city: string;
  departure_airports: AirportCityRef[];
  arrival_airports: AirportCityRef[];
};

export type CountryAirports = {
  country: string;
  cities: CityAirports[];
};

export type CityView = {
  city: string;
  airports: AirportCityRef[];
};

export type CountryView = {
  country: string;
  cities: CityView[];
};

export type AirportCoordinates = {
  longitude: number;
  latitude: number;
};

export type AirportTimezone = {
  name: string;
  offset: string;
};

export type AirportDetails = {
  airport_code: string;
  airport_name: string;
  country: string;
  city: string;
  coordinates: AirportCoordinates;
  timezone: AirportTimezone;
};

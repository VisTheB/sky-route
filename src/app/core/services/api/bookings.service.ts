import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  RouteOption,
  FareConditions,
  Booking,
  CreateBookingRequest,
  BookingSummary,
} from '../../models';
import { ProfileService } from '../profile.service';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private api = inject(ApiService);
  private profileService = inject(ProfileService);

  async createBookingForCurrentUser(
    route: RouteOption,
    fareClass: FareConditions,
  ): Promise<Booking> {
    const passenger = this.buildPassengerFromProfile();
    const flightIds = route.segments.map((s) => s.flight_id);

    const body: CreateBookingRequest = {
      flight_ids: flightIds,
      fare_conditions: fareClass,
      passengers: [passenger],
    };

    const headers = new HttpHeaders({
      'Idempotency-Key': crypto.randomUUID(),
    });

    return firstValueFrom(this.api.post<Booking>('bookings', body, headers));
  }

  async getBooking(bookRef: string): Promise<Booking> {
    return firstValueFrom(this.api.get<Booking>(`bookings/${bookRef}`));
  }

  private buildPassengerFromProfile(): {
    passenger_id: string;
    passenger_name: string;
  } {
    const profile = this.profileService.profile();
    const passport = profile?.passport;

    if (!passport) {
      throw new BookingError(
        'NO_PASSPORT',
        'Please fill in your passport data in your profile first.',
      );
    }

    const passenger_id = passport.passportNumber;
    const passenger_name = `${passport.firstName} ${passport.lastName}`.trim().toUpperCase();

    return { passenger_id, passenger_name };
  }

  async listForCurrentUser(): Promise<BookingSummary[]> {
    const profile = this.profileService.profile();
    const passport = profile?.passport;

    if (!passport) {
      throw new BookingError(
        'NO_PASSPORT',
        'Please fill in your passport data in your profile first.',
      );
    }

    return firstValueFrom(this.api.get<BookingSummary[]>('bookings'));
  }
}

export class BookingError extends Error {
  constructor(
    public readonly code: 'NO_PASSPORT' | 'API_ERROR',
    message: string,
  ) {
    super(message);
    this.name = 'BookingError';
  }
}

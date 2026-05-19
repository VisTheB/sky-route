import { Injectable, inject, signal } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { BookingError, BookingsService } from '../../core/services';
import { BookingSummary } from '../../core/models/booking.model';

type ListState = 'idle' | 'loading' | 'no-passport' | 'error' | 'loaded';

@Injectable()
export class BookingsListService {
  private bookingsService = inject(BookingsService);

  readonly bookings = signal<BookingSummary[]>([]);
  readonly state = signal<ListState>('idle');
  readonly errorMessage = signal<string | null>(null);

  async load() {
    this.state.set('loading');
    this.errorMessage.set(null);

    try {
      const list = await this.bookingsService.listForCurrentUser();
      this.bookings.set(list);
      this.state.set('loaded');
    } catch (error) {
      if (error instanceof BookingError && error.code === 'NO_PASSPORT') {
        this.state.set('no-passport');
        return;
      }
      Sentry.captureException(error);
      console.error('Failed to load bookings', error);
      this.errorMessage.set('Failed to load bookings. Please try again.');
      this.state.set('error');
    }
  }
}

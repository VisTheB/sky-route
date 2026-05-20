import { Injectable, inject, signal } from '@angular/core';
import { TuiNotificationService } from '@taiga-ui/core/components/notification';
import { HttpErrorResponse } from '@angular/common/http';
import * as Sentry from '@sentry/angular';
import { BookingsService } from '../../core/services';
import { Booking } from '../../core/models';
import { Router } from '@angular/router';

@Injectable()
export class BookingDetailService {
  protected readonly notifications = inject(TuiNotificationService);
  private bookingsService = inject(BookingsService);
  private router = inject(Router);

  readonly booking = signal<Booking | null>(null);
  readonly isLoading = signal(false);

  async load(bookRef: string) {
    this.isLoading.set(true);

    try {
      const booking = await this.bookingsService.getBooking(bookRef);
      this.booking.set(booking);
    } catch (error) {
      console.error('Failed to load booking', error);
      const status = error instanceof HttpErrorResponse ? error.status : undefined;
      if (status === 404) {
        this.processError('Booking not found', 'Not found');
      } else if (status === 401) {
        this.processError('You do not have access to this booking', 'Unauthorized');
      } else if (status === 403) {
        this.processError('You do not have access to this booking', 'Forbidden');
      } else {
        Sentry.captureException(error);
        this.processError('Failed to load booking', 'Error');
      }
      this.booking.set(null);
      this.router.navigate(['/bookings']);
    } finally {
      this.isLoading.set(false);
    }
  }

  private processError(message: string, label: string) {
    this.notifications
      .open(message, {
        label: label,
        autoClose: 5500,
        size: 'l',
      })
      .subscribe();
  }
}

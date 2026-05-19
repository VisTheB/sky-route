import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { TuiButton, TuiNotificationService, type TuiDialogContext } from '@taiga-ui/core';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { injectContext } from '@taiga-ui/polymorpheus';
import { DecimalPipe } from '@angular/common';
import { RouteOption, FareConditions, RouteSegment } from '../../../../core/models';
import { TimeWithTimezonePipe, DurationPipe } from '../../../../shared/pipes';
import { BookingsService, BookingError } from '../../../../core/services';

export type RouteDetailsDialogData = {
  route: RouteOption;
  fareClass: FareConditions;
  connectionsLabel: string;
  firstSegment: RouteSegment;
  lastSegment: RouteSegment;
};

@Component({
  selector: 'app-route-details-dialog-component',
  imports: [TuiButton, TuiCurrencyPipe, DecimalPipe, DurationPipe, TimeWithTimezonePipe],
  templateUrl: './route-details-dialog-component.html',
  styleUrl: './route-details-dialog-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDetailsDialogComponent {
  protected readonly context = injectContext<TuiDialogContext<void, RouteDetailsDialogData>>();
  protected readonly notifications = inject(TuiNotificationService);
  private router = inject(Router);
  private bookingsService = inject(BookingsService);

  protected isBooking = signal(false);
  protected route = computed(() => this.context.data.route);
  protected fareClass = computed(() => this.context.data.fareClass);
  protected firstSegment = computed(() => this.context.data.firstSegment);
  protected lastSegment = computed(() => this.context.data.lastSegment);
  protected connectionsLabel = computed(() => this.context.data.connectionsLabel);

  protected layoverMinutes(prevSegmentIndex: number): number {
    const segments = this.route().segments;
    const arrival = parseIsoToTimestamp(segments[prevSegmentIndex].scheduled_arrival);
    const departure = parseIsoToTimestamp(segments[prevSegmentIndex + 1].scheduled_departure);
    return Math.round((departure - arrival) / 60000);
  }

  protected async onBook() {
    if (this.isBooking()) return;

    this.isBooking.set(true);
    try {
      const booking = await this.bookingsService.createBookingForCurrentUser(
        this.route(),
        this.fareClass(),
      );

      this.context.$implicit.complete();
      this.router.navigate(['/bookings', booking.book_ref]);
    } catch (error) {
      this.handleBookingError(error);
    } finally {
      this.isBooking.set(false);
    }
  }

  protected onClose() {
    this.context.$implicit.complete();
  }

  private handleBookingError(error: unknown) {
    if (error instanceof BookingError && error.code === 'NO_PASSPORT') {
      this.context.$implicit.complete();
      this.notifications
        .open(error.message, {
          label: 'Profile incomplete',
          autoClose: 4000,
        })
        .subscribe();
      this.router.navigate(['/profile']);
      return;
    }

    console.error('Booking failed', error);
    this.notifications
      .open('Failed to create booking. Please try again.', {
        label: 'Error',
        autoClose: 3000,
      })
      .subscribe();
  }
}

function parseIsoToTimestamp(iso: string): number {
  return new Date(iso).getTime();
}

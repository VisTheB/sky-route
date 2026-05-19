import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TimeWithTimezonePipe } from '../../shared/pipes';
import { BookingDetailService } from './booking-detail.service';
import { FlightItemComponent } from './components/flight-item-component/flight-item-component';

@Component({
  selector: 'app-booking-detail-page-component',
  imports: [
    RouterLink,
    TuiCardLarge,
    TuiCurrencyPipe,
    DecimalPipe,
    TimeWithTimezonePipe,
    FlightItemComponent,
  ],
  templateUrl: './booking-detail-page-component.html',
  styleUrl: './booking-detail-page-component.scss',
  providers: [BookingDetailService],
})
export class BookingDetailPageComponent {
  protected bookingDetService = inject(BookingDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected bookRef = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected passengers = computed(() => {
    const booking = this.bookingDetService.booking();
    if (!booking) return [];

    const seen = new Set<string>();
    const result: { passenger_id: string; passenger_name: string }[] = [];
    for (const ticket of booking.tickets) {
      if (!seen.has(ticket.passenger_id)) {
        seen.add(ticket.passenger_id);
        result.push({
          passenger_id: ticket.passenger_id,
          passenger_name: ticket.passenger_name,
        });
      }
    }
    return result;
  });

  protected segments = computed(() => {
    const booking = this.bookingDetService.booking();
    return booking?.tickets[0]?.segments ?? [];
  });

  constructor() {
    effect(() => {
      const ref = this.bookRef().get('ref');
      if (ref) {
        void this.bookingDetService.load(ref);
      } else {
        this.router.navigate(['/bookings']);
      }
    });
  }
}

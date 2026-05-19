import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { BookingSummary } from '../../../../core/models';
import { TimeWithTimezonePipe } from '../../../../shared/pipes';

@Component({
  selector: 'app-booking-card-component',
  imports: [RouterLink, TuiCurrencyPipe, DecimalPipe, TimeWithTimezonePipe],
  templateUrl: './booking-card-component.html',
  styleUrl: './booking-card-component.scss',
})
export class BookingCardComponent {
  booking = input.required<BookingSummary>();

  protected passengersLabel = computed(() => {
    const n = this.booking().passengers_count;
    return n === 1 ? '1 passenger' : `${n} passengers`;
  });

  protected fareLabel = computed(() => this.booking().fare_conditions.toLowerCase());
}

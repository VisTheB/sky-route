import { Component, computed, inject, input } from '@angular/core';
import { AirportScheduleService } from '../../airport-schedule.service';
import { TuiButton, TuiLoader, TuiNotificationService } from '@taiga-ui/core';
import { TimeWithTimezonePipe } from '../../../../shared/pipes';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../../../core/services';
import {
  ScheduleTab,
  OutboundFlightEntry,
  InboundFlightEntry,
  FareConditions,
  FlightStatus,
} from '../../../../core/models';

@Component({
  selector: 'app-airport-schedule-component',
  imports: [TuiButton, TimeWithTimezonePipe, TuiLoader],
  templateUrl: './airport-schedule-component.html',
  styleUrl: './airport-schedule-component.scss',
})
export class AirportScheduleComponent {
  protected readonly notifications = inject(TuiNotificationService);
  protected airScheduleService = inject(AirportScheduleService);
  private router = inject(Router);
  private analytics = inject(AnalyticsService);

  airportCode = input.required<string>();
  protected outboundItems = computed(() => this.airScheduleService.outboundItems());
  protected inboundItems = computed(() => this.airScheduleService.inboundItems());

  protected onTabClick(tab: ScheduleTab) {
    this.airScheduleService.switchTab(tab);
  }

  protected onLoadMore() {
    void this.airScheduleService.loadMore();
  }

  protected onOutboundClick(item: OutboundFlightEntry) {
    const status = item.status;
    if (status === 'Cancelled' || status === 'Departed' || status === 'Arrived') {
      this.notifications
        .open('That flight is not bookable', {
          label: 'Info',
          autoClose: 4000,
        })
        .subscribe();
      return;
    }
    this.analytics.airportScheduleFlightClicked();
    this.navigateToSearch({
      from: this.airportCode(),
      to: item.destination_code,
      date: extractDate(item.departure_local),
    });
  }

  protected onInboundClick(item: InboundFlightEntry) {
    const status = item.status;
    if (status === 'Cancelled' || status === 'Departed' || status === 'Arrived') {
      this.notifications
        .open('That flight is not bookable', {
          label: 'Info',
          autoClose: 4000,
        })
        .subscribe();
      return;
    }
    this.analytics.airportScheduleFlightClicked();
    this.navigateToSearch({
      from: item.origin_code,
      to: this.airportCode(),
      date: extractDate(item.arrival_local),
    });
  }

  private navigateToSearch(params: { from: string; to: string; date: string }) {
    this.router.navigate(['/routes/search'], {
      queryParams: {
        from: params.from,
        to: params.to,
        date: params.date,
        class: FareConditions.Economy,
        max_connections: '0',
      },
    });
  }

  protected statusClass(status: FlightStatus): string {
    switch (status) {
      case 'On Time':
      case 'Scheduled':
        return 'status-ok';
      case 'Delayed':
        return 'status-warn';
      case 'Departed':
      case 'Arrived':
        return 'status-done';
      case 'Cancelled':
        return 'status-bad';
      default:
        return '';
    }
  }
}

function extractDate(iso: string): string {
  const match = iso.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

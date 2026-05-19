import { Component, computed, inject, input, signal } from '@angular/core';
import { TuiButton, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TimeWithTimezonePipe } from '../../../../shared/pipes';
import {
  BookingSegment,
  CheckInStatus,
  CHECK_IN_OPENS_HOURS_BEFORE,
  CHECK_IN_CLOSES_MINUTES_BEFORE,
  CheckInDialogData,
  FareConditions,
  BoardingPass,
} from '../../../../core/models';
import { NowService, AnalyticsService } from '../../../../core/services';
import { CheckinDialogComponent } from '../checkin-dialog-component/checkin-dialog-component';

@Component({
  selector: 'app-flight-item-component',
  imports: [TuiButton, TimeWithTimezonePipe],
  templateUrl: './flight-item-component.html',
  styleUrl: './flight-item-component.scss',
})
export class FlightItemComponent {
  segment = input.required<BookingSegment>();
  bookRef = input.required<string>();
  ticketNo = input.required<string>();
  private nowService = inject(NowService);
  private dialogs = inject(TuiDialogService);
  private analytics = inject(AnalyticsService);

  private now = signal<Date | null>(null);
  private localHasBoardingPass = signal(false);

  protected hasBoardingPass = computed(() => {
    return this.segment().has_b_pass || this.localHasBoardingPass();
  });

  protected checkInStatus = computed<CheckInStatus>(() => {
    const now = this.now();
    if (!now) return 'unknown';

    const departure = new Date(this.segment().scheduled_departure);
    const diffMs = departure.getTime() - now.getTime();
    const diffMinutes = diffMs / 60000;

    if (diffMinutes > CHECK_IN_OPENS_HOURS_BEFORE * 60) return 'not-yet';
    if (diffMinutes < CHECK_IN_CLOSES_MINUTES_BEFORE) return 'closed';
    return 'available';
  });

  protected checkInHint = computed<string>(() => {
    const now = this.now();
    if (!now) return '';

    const departure = new Date(this.segment().scheduled_departure);
    const diffMs = departure.getTime() - now.getTime();
    const diffHours = diffMs / 3600000;

    if (this.checkInStatus() === 'not-yet') {
      const hoursUntilOpen = diffHours - CHECK_IN_OPENS_HOURS_BEFORE;
      if (hoursUntilOpen > 24) {
        const days = Math.ceil(hoursUntilOpen / 24);
        return `Opens in ${days} day${days > 1 ? 's' : ''}`;
      }
      return `Opens in ${Math.ceil(hoursUntilOpen)} hours`;
    }
    if (this.checkInStatus() === 'closed') return 'Check-in is closed';
    return '';
  });

  constructor() {
    void this.loadNow();
  }

  private async loadNow() {
    try {
      const now = await this.nowService.getNow();
      this.now.set(now);
    } catch (error) {
      console.error('Failed to load /now', error);
    }
  }

  protected openCheckInDialog() {
    this.analytics.onlineCheckinStarted();
    const data: CheckInDialogData = {
      ticket_no: this.ticketNo(),
      flight_id: this.segment().flight_id,
      flight_no: this.segment().flight_no,
      fare_conditions: this.segment().fare_conditions as FareConditions,
      mode: this.hasBoardingPass() ? 'pass' : 'choosing',
    };

    this.dialogs
      .open<BoardingPass | null>(new PolymorpheusComponent(CheckinDialogComponent), {
        size: 'm',
        data,
        closable: false,
      })
      .subscribe((pass) => {
        if (pass) this.localHasBoardingPass.set(true);
      });
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SlicePipe } from '@angular/common';
import {
  TuiButton,
  TuiNotificationService,
  type TuiDialogContext,
  TuiLoader,
} from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { BoardingPass, CheckInDialogData, AvailableSeat, Mode } from '../../../../core/models';
import { CheckinService } from '../../../../core/services';

@Component({
  selector: 'app-checkin-dialog-component',
  imports: [TuiButton, TuiLoader, SlicePipe],
  templateUrl: './checkin-dialog-component.html',
  styleUrl: './checkin-dialog-component.scss',
})
export class CheckinDialogComponent {
  protected readonly context =
    injectContext<TuiDialogContext<BoardingPass | null, CheckInDialogData>>();
  private checkinService = inject(CheckinService);
  protected readonly notifications = inject(TuiNotificationService);

  protected isLoading = signal(false);
  protected isSubmitting = signal(false);
  protected seats = signal<AvailableSeat[]>([]);
  protected selectedSeat = signal<string | null>(null);
  protected boardingPass = signal<BoardingPass | null>(null);

  protected mode = signal<Mode>(this.context.data.mode);
  protected ticketClass = computed(() => this.context.data.fare_conditions);
  protected seatsOfMyClass = computed(() =>
    this.seats().filter((s) => s.fare_conditions === this.ticketClass()),
  );

  // Группировка мест по рядам для отображения в виде сетки
  protected seatRows = computed(() => {
    const grouped = new Map<number, AvailableSeat[]>();
    for (const seat of this.seatsOfMyClass()) {
      const match = seat.seat_no.match(/^(\d+)([A-Za-z])$/);
      if (!match) continue;
      const row = parseInt(match[1], 10);
      if (!grouped.has(row)) grouped.set(row, []);
      grouped.get(row)!.push(seat);
    }
    for (const [, list] of grouped) {
      list.sort((a, b) => a.seat_no.localeCompare(b.seat_no));
    }
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([row, list]) => ({ row, seats: list }));
  });

  constructor() {
    void this.init();
  }

  private async init() {
    this.isLoading.set(true);
    if (this.mode() === 'pass') {
      try {
        const pass = await this.checkinService.getUserPass(
          this.context.data.ticket_no,
          this.context.data.flight_id,
        );
        this.boardingPass.set(pass);
      } catch (error) {
        console.error('Failed to load boarding pass', error);
        const status = error instanceof HttpErrorResponse ? error.status : undefined;
        if (status === 404) {
          this.processError('Boarding pass not found.', 'Not found');
        } else if (status === 403) {
          this.processError('You do not have access to this boarding pass', 'Forbidden');
        } else if (status === 401) {
          this.processError('Unauthorized. Please log in again.', 'Unauthorized');
        } else {
          this.processError('Failed to load boarging pass. Please try again.', 'Error');
        }
      } finally {
        this.isLoading.set(false);
      }
    } else {
      try {
        const seats = await this.checkinService.getSeats(this.context.data.flight_id);
        this.seats.set(seats);
      } catch (error) {
        console.error('Failed to load seats', error);
        const status = error instanceof HttpErrorResponse ? error.status : undefined;
        if (status === 404) {
          this.processError('Seats not found.', 'Not found');
        } else if (status === 401) {
          this.processError('Unauthorized. Please log in again.', 'Unauthorized');
        } else {
          this.processError('Failed to load seats. Please try again.', 'Error');
        }
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  protected onSeatClick(seat: AvailableSeat) {
    if (!seat.available) return;
    this.selectedSeat.set(this.selectedSeat() === seat.seat_no ? null : seat.seat_no);
  }

  protected isSeatSelected(seatNo: string): boolean {
    return this.selectedSeat() === seatNo;
  }

  protected async onSubmit() {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);

    try {
      const pass = await this.checkinService.checkIn({
        ticket_no: this.context.data.ticket_no,
        flight_id: this.context.data.flight_id,
        seat_no: this.selectedSeat() ?? undefined,
      });
      this.boardingPass.set(pass);
      this.context.$implicit.next(pass);
      this.mode.set('pass');
      this.notifications
        .open('Check-in successful!', {
          label: 'Success',
          autoClose: 4000,
        })
        .subscribe();
    } catch (error) {
      console.error('Check-in failed', error);
      const status = error instanceof HttpErrorResponse ? error.status : undefined;
      if (status === 409) {
        this.processError('This seat was just taken. Please pick another one.', 'Seat taken');
      } else if (status === 401) {
        this.processError('Unauthorized. Please log in again.', 'Unauthorized');
      } else if (status === 403) {
        this.processError('You do not have access to this booking', 'Forbidden');
      } else if (status === 422) {
        this.processError(
          'Check-in window is closed or no seats available.',
          'Check-in unavailable',
        );
      } else if (status === 404) {
        this.processError('Flight or ticket not found.', 'Not found');
      } else {
        this.processError('Check-in failed. Please try again.', 'Error');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected onClose() {
    this.context.$implicit.complete();
  }

  private processError(message: string, label: string) {
    this.notifications
      .open(message, {
        label: label,
        autoClose: 4000,
      })
      .subscribe();
  }
}

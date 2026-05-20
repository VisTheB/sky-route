import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TuiLoader, TuiNotificationService } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { AirportDetails } from '../../core/models';
import { AirportsService } from '../../core/services';
import { AirportScheduleService } from './airport-schedule.service';
import { AirportScheduleComponent } from './components/airport-schedule-component/airport-schedule-component';

@Component({
  selector: 'app-airport-detail-page-component',
  imports: [RouterLink, TuiCardLarge, TuiLoader, AirportScheduleComponent],
  templateUrl: './airport-detail-page-component.html',
  styleUrl: './airport-detail-page-component.scss',
  providers: [AirportScheduleService],
})
export class AirportDetailPageComponent {
  protected readonly notifications = inject(TuiNotificationService);
  protected airScheduleService = inject(AirportScheduleService);
  private airportsService = inject(AirportsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  protected code = toSignal(this.activatedRoute.paramMap, {
    initialValue: this.activatedRoute.snapshot.paramMap,
  });
  protected airport = signal<AirportDetails | null>(null);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  protected coordinatesLabel = computed(() => {
    const data = this.airport();
    if (!data) return '';

    const { latitude, longitude } = data.coordinates;
    const lat = formatCoord(latitude, 'N', 'S');
    const lon = formatCoord(longitude, 'E', 'W');
    return `${lat}, ${lon}`;
  });

  constructor() {
    effect(() => {
      const code = this.code().get('code');
      if (code) {
        void this.load(code);
      } else {
        this.router.navigate(['/airports']);
      }
    });
  }

  private async load(code: string) {
    this.isLoading.set(true);
    this.error.set(null);
    this.airport.set(null);

    try {
      const data = await this.airportsService.getByCode(code);
      this.airport.set(data);
      this.airScheduleService.init(code);
    } catch (error) {
      console.error('Failed to load airport', error);
      const status = error instanceof HttpErrorResponse ? error.status : undefined;
      if (status === 404) {
        this.error.set('Airport not found');
        this.processError('Airport not found.', 'Not found');
      } else {
        this.error.set('Failed to load airport');
        this.processError('Failed to load airport.', 'Error');
      }
    } finally {
      this.isLoading.set(false);
    }
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

function formatCoord(value: number, positive: string, negative: string): string {
  const abs = Math.abs(value).toFixed(2);
  const orientation = value >= 0 ? positive : negative;
  return `${abs}°${orientation}`;
}

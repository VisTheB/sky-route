import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';

type NowResponse = {
  now: string;
};

@Injectable({ providedIn: 'root' })
export class NowService {
  private api = inject(ApiService);

  private cachedNow = signal<Date | null>(null);
  private fetchPromise: Promise<Date> | null = null;

  async getNow(): Promise<Date> {
    const cached = this.cachedNow();
    if (cached) return cached;
    if (this.fetchPromise) return this.fetchPromise;

    this.fetchPromise = firstValueFrom(this.api.get<NowResponse>('now')).then((response) => {
      const date = new Date(response.now);
      this.cachedNow.set(date);
      this.fetchPromise = null;
      return date;
    });

    return this.fetchPromise;
  }
}

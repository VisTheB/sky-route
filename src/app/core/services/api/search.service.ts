import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RouteOption, SearchParams } from '../../models';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private api = inject(ApiService);

  async search(params: SearchParams): Promise<RouteOption[]> {
    return firstValueFrom(
      this.api.get<RouteOption[]>('routes/search', {
        from: params.from,
        to: params.to,
        date: params.date,
        class: params.class,
        max_connections: params.max_connections,
      }),
    );
  }
}

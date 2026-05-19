import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AirportDetails,
  CountryAirports,
  PaginatedInbound,
  PaginatedOutbound,
  PaginationQuery,
} from '../../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AirportsService {
  private api = inject(ApiService);

  async listAirports(): Promise<CountryAirports[]> {
    return firstValueFrom(this.api.get<CountryAirports[]>('airports'));
  }

  async getByCode(code: string): Promise<AirportDetails> {
    return firstValueFrom(this.api.get<AirportDetails>(`airports/${code}`));
  }

  async getOutboundFlights(code: string, query: PaginationQuery = {}): Promise<PaginatedOutbound> {
    return firstValueFrom(this.api.get<PaginatedOutbound>(`airports/${code}/outbound`, query));
  }

  async getInboundFlights(code: string, query: PaginationQuery = {}): Promise<PaginatedInbound> {
    return firstValueFrom(this.api.get<PaginatedInbound>(`airports/${code}/inbound`, query));
  }
}

import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AvailableSeat, BoardingPass, CheckInRequest } from '../../models/';
import { ApiService } from './api.service';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class CheckinService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  async getSeats(flightId: number): Promise<AvailableSeat[]> {
    return firstValueFrom(
      this.api.get<AvailableSeat[]>('checkin/seats', {
        flight_id: flightId,
      }),
    );
  }

  async checkIn(request: CheckInRequest): Promise<BoardingPass> {
    return await firstValueFrom(this.api.post<BoardingPass>('checkin', request));
  }

  async getUserPass(ticketNo: string, flightId: number): Promise<BoardingPass> {
    return firstValueFrom(
      this.api.get<BoardingPass>('checkin/boarding-pass', {
        ticket_no: ticketNo,
        flight_id: flightId,
      }),
    );
  }
}

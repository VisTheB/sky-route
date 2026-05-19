import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { BookingsListService } from './bookings-list.service';
import { ProfileService } from '../../core/services/profile.service';
import { BookingCardComponent } from './components/booking-card-component/booking-card-component';

@Component({
  selector: 'app-booking-list-page-component',
  imports: [TuiButton, TuiCardLarge, BookingCardComponent],
  templateUrl: './booking-list-page-component.html',
  styleUrl: './booking-list-page-component.scss',
  providers: [BookingsListService],
})
export class BookingListPageComponent {
  protected bookingsListService = inject(BookingsListService);
  protected profileService = inject(ProfileService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      const profile = this.profileService.profile();
      if (profile !== null && this.bookingsListService.state() === 'idle') {
        void this.bookingsListService.load();
      }
    });
  }

  protected onRetry() {
    void this.bookingsListService.load();
  }

  protected goToProfile() {
    this.router.navigate(['/profile']);
  }
}

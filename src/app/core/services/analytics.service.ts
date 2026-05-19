import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

type AuthMethod = 'email' | 'google';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private analytics = inject(Analytics);

  authSignup(method: AuthMethod) {
    logEvent(this.analytics, 'auth_signup', { method });
  }

  authLogin(method: AuthMethod) {
    logEvent(this.analytics, 'auth_login', { method });
  }

  authLogout() {
    logEvent(this.analytics, 'auth_logout');
  }

  searchPerformed() {
    logEvent(this.analytics, 'search_performed');
  }

  searchNoResults() {
    logEvent(this.analytics, 'search_no_results');
  }

  routeCardClicked() {
    logEvent(this.analytics, 'route_card_clicked');
  }

  bookingStarted() {
    logEvent(this.analytics, 'booking_started');
  }

  bookingCompleted() {
    logEvent(this.analytics, 'booking_completed');
  }

  bookingFailed() {
    logEvent(this.analytics, 'booking_failed');
  }

  airportViewed(airportCode: string) {
    logEvent(this.analytics, 'airport_viewed', { airport_code: airportCode });
  }

  airportScheduleFlightClicked() {
    logEvent(this.analytics, 'airport_schedule_flight_clicked');
  }

  bookingViewed() {
    logEvent(this.analytics, 'booking_viewed');
  }

  onlineCheckinStarted() {
    logEvent(this.analytics, 'online_checkin_started');
  }

  onlineCheckinCompleted() {
    logEvent(this.analytics, 'online_checkin_completed');
  }

  popularDestinationClicked(destination: string) {
    logEvent(this.analytics, 'popular_destination_clicked', { destination });
  }
}

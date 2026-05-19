import { computed, inject, Injectable, signal } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { AirportsService } from '../../core/services';
import { CountryAirports, CountryView, CityView, AirportCityRef } from '../../core/models';
import { TuiNotificationService } from '@taiga-ui/core';

@Injectable()
export class AirportsListService {
  protected readonly notifications = inject(TuiNotificationService);
  private airportsService = inject(AirportsService);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal('');
  private raw = signal<CountryAirports[]>([]);

  private merged = computed<CountryView[]>(() => {
    return this.raw().map((country) => ({
      country: country.country,
      cities: country.cities.map((city) => ({
        city: city.city,
        airports: mergeAirports(city.departure_airports, city.arrival_airports),
      })),
    }));
  });

  readonly filtered = computed<CountryView[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.merged();

    return this.merged()
      .map((country) => {
        const countryMatches = country.country.toLowerCase().includes(query);
        const cities = country.cities
          .map((city) => {
            const cityMatches = city.city.toLowerCase().includes(query);
            const airports =
              countryMatches || cityMatches
                ? city.airports
                : city.airports.filter(
                    (a) =>
                      a.airport_code.toLowerCase().includes(query) ||
                      a.airport_name.toLowerCase().includes(query),
                  );

            return airports.length > 0 ? { city: city.city, airports } : null;
          })
          .filter((c): c is CityView => c !== null);

        return cities.length > 0 ? { country: country.country, cities } : null;
      })
      .filter((c): c is CountryView => c !== null);
  });

  readonly totalFoundAirports = computed(() => {
    let count = 0;
    for (const country of this.filtered()) {
      for (const city of country.cities) {
        count += city.airports.length;
      }
    }
    return count;
  });

  async load() {
    if (this.raw().length > 0) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const data = await this.airportsService.listAirports();
      this.raw.set(data);
    } catch (err) {
      Sentry.captureException(err);
      console.error('Failed to load airports', err);
      this.error.set('Failed to load airports list');
      this.notifications
        .open('Failed to load airports list', {
          label: 'Error',
          autoClose: 4000,
        })
        .subscribe();
    } finally {
      this.isLoading.set(false);
    }
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }
}

function mergeAirports(a: AirportCityRef[], b: AirportCityRef[]): AirportCityRef[] {
  const seen = new Set<string>();
  const result: AirportCityRef[] = [];

  for (const list of [a, b]) {
    for (const airport of list) {
      if (seen.has(airport.airport_code)) continue;
      seen.add(airport.airport_code);
      result.push(airport);
    }
  }
  return result.sort((x, y) => x.airport_code.localeCompare(y.airport_code));
}

import { Injectable, computed, inject, signal } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { EMPTY_FILTERS, Filters, SortKey, SearchParams, RouteOption } from '../../core/models';
import { SearchService, AnalyticsService } from '../../core/services';

@Injectable()
export class SearchResultsService {
  private searchService = inject(SearchService);
  private analytics = inject(AnalyticsService);

  readonly rawResults = signal<RouteOption[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentParams = signal<SearchParams | null>(null);
  readonly filters = signal<Filters>({ ...EMPTY_FILTERS });
  readonly sort = signal<SortKey>('price-asc');

  readonly priceRange = computed<[number, number] | null>(() => {
    const list = this.rawResults();
    if (list.length === 0) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const r of list) {
      min = Math.min(min, r.total_price);
      max = Math.max(max, r.total_price);
    }
    return [Math.floor(min), Math.ceil(max)];
  });

  readonly durationRange = computed<[number, number] | null>(() => {
    const list = this.rawResults();
    if (list.length === 0) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const r of list) {
      min = Math.min(min, r.total_duration_minutes);
      max = Math.max(max, r.total_duration_minutes);
    }
    return [min, max];
  });

  readonly availableConnections = computed<number[]>(() => {
    const set = new Set<number>();
    for (const r of this.rawResults()) {
      set.add(r.connections);
    }
    return Array.from(set).sort((a, b) => a - b);
  });

  readonly filteredResults = computed<RouteOption[]>(() => {
    const list = this.rawResults();
    const filters = this.filters();

    return list.filter((route) => {
      if (filters.priceMin !== null && route.total_price < filters.priceMin) return false;
      if (filters.priceMax !== null && route.total_price > filters.priceMax) return false;

      if (
        filters.durationMaxMinutes !== null &&
        route.total_duration_minutes > filters.durationMaxMinutes
      ) {
        return false;
      }

      if (filters.connections.length > 0 && !filters.connections.includes(route.connections)) {
        return false;
      }

      return true;
    });
  });

  readonly displayResults = computed<RouteOption[]>(() => {
    const filtered = this.filteredResults();
    const sortKey = this.sort();
    return sortRoutes(filtered, sortKey);
  });

  readonly totalCount = computed(() => this.rawResults().length);
  readonly filteredCount = computed(() => this.displayResults().length);

  async search(params: SearchParams) {
    const prev = this.currentParams();
    if (prev && areParamsEqual(prev, params)) return;

    this.currentParams.set(params);
    this.isLoading.set(true);
    this.error.set(null);
    this.resetFilters();
    this.clearSort();

    try {
      const response = await this.searchService.search(params);
      this.rawResults.set(response);
      if (response.length === 0) {
        this.analytics.searchNoResults();
      }
    } catch (error) {
      console.error('Search failed', error);
      this.rawResults.set([]);
      this.error.set('Failed to load search results. Please try again.');
      Sentry.captureException(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  updateFilters(patch: Partial<Filters>) {
    this.filters.update((current) => ({ ...current, ...patch }));
  }

  resetFilters() {
    this.filters.set({ ...EMPTY_FILTERS });
  }

  setSort(sort: SortKey) {
    this.sort.set(sort);
  }

  clearSort() {
    this.sort.set('price-asc');
  }

  clearResults() {
    this.rawResults.set([]);
    this.error.set(null);
    this.currentParams.set(null);
    this.resetFilters();
  }
}

function sortRoutes(routes: RouteOption[], key: SortKey): RouteOption[] {
  const copy = [...routes];
  switch (key) {
    case 'price-asc':
      return copy.sort((a, b) => a.total_price - b.total_price);
    case 'price-desc':
      return copy.sort((a, b) => b.total_price - a.total_price);
    case 'duration-asc':
      return copy.sort((a, b) => a.total_duration_minutes - b.total_duration_minutes);
    case 'durations-desc':
      return copy.sort((a, b) => b.total_duration_minutes - a.total_duration_minutes);
  }
}

function areParamsEqual(a: SearchParams, b: SearchParams): boolean {
  return (
    a.from === b.from &&
    a.to === b.to &&
    a.date === b.date &&
    a.class === b.class &&
    a.max_connections === b.max_connections
  );
}

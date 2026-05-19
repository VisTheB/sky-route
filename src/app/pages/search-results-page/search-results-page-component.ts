import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TuiButton } from '@taiga-ui/core';
import { SearchResultsService } from './search-results.service';
import { SearchFormComponent } from '../../shared';
import { RouteCardComponent } from './components/route-card-component/route-card-component';
import { SearchResultsFiltersComponent } from './components/search-results-filters-component/search-results-filters-component';
import { SearchResultsSortComponent } from './components/search-results-sort-component/search-results-sort-component';
import { FareConditions, MaxConnectionsParam, SearchParams } from '../../core/models';

@Component({
  selector: 'app-search-results-page-component',
  imports: [
    TuiButton,
    SearchFormComponent,
    SearchResultsFiltersComponent,
    SearchResultsSortComponent,
    RouteCardComponent,
  ],
  templateUrl: './search-results-page-component.html',
  styleUrl: './search-results-page-component.scss',
  providers: [SearchResultsService],
})
export class SearchResultsPageComponent {
  protected searchResService = inject(SearchResultsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private paramsSignal = toSignal(this.activatedRoute.queryParamMap, {
    initialValue: this.activatedRoute.snapshot.queryParamMap,
  });

  protected searchParams = computed<SearchParams | null>(() => {
    const params = this.paramsSignal();
    const from = params.get('from');
    const to = params.get('to');
    const date = params.get('date');
    const fareClass = params.get('class') as FareConditions | null;
    const maxConn = (params.get('max_connections') ?? 'unbound') as MaxConnectionsParam;

    if (!from || !to || !date || !fareClass) return null;

    return {
      from,
      to,
      date,
      class: fareClass,
      max_connections: maxConn,
    };
  });
  protected isFormOpen = signal(false);

  constructor() {
    effect(() => {
      const params = this.searchParams();
      if (params) {
        void this.searchResService.search(params);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  toggleForm() {
    this.isFormOpen.update((v) => !v);
  }

  retrySearch() {
    const params = this.searchParams();
    if (params) {
      void this.searchResService.search(params);
    }
  }

  resetFiltersAndRetry() {
    this.searchResService.resetFilters();
  }
}

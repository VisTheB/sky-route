import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiNumberFormat, TuiTextfield, TuiCheckbox, TuiLabel } from '@taiga-ui/core';
import { TuiInputSlider } from '@taiga-ui/kit';
import { SearchResultsService } from '../../search-results.service';
import { DurationPipe } from '../../../../shared/pipes';
@Component({
  selector: 'app-search-results-filters-component',
  imports: [
    FormsModule,
    TuiButton,
    TuiTextfield,
    TuiLabel,
    TuiInputSlider,
    TuiNumberFormat,
    TuiCheckbox,
    TuiInputSlider,
    DurationPipe,
  ],
  templateUrl: './search-results-filters-component.html',
  styleUrl: './search-results-filters-component.scss',
})
export class SearchResultsFiltersComponent {
  protected service = inject(SearchResultsService);

  protected priceMax = signal<number>(0);
  protected durationMax = signal<number>(0);

  protected priceRange = computed(() => this.service.priceRange());
  protected durationRange = computed(() => this.service.durationRange());
  protected availableConnections = computed(() => this.service.availableConnections());
  protected priceMin = computed(() => this.priceRange()?.[0] ?? 0);
  protected priceMaxLimit = computed(() => this.priceRange()?.[1] ?? 0);
  protected durationMinLimit = computed(() => this.durationRange()?.[0] ?? 0);
  protected durationMaxLimit = computed(() => this.durationRange()?.[1] ?? 0);

  protected hasResults = computed(() => this.service.totalCount() > 0);

  constructor() {
    effect(() => {
      const range = this.priceRange();
      if (range) {
        this.priceMax.set(range[1]);
      }
    });

    effect(() => {
      const range = this.durationRange();
      if (range) {
        this.durationMax.set(range[1]);
      }
    });
  }

  protected onPriceChange(value: number) {
    this.priceMax.set(value);
    const range = this.priceRange();
    const isAtMax = !range || value >= range[1];
    this.service.updateFilters({
      priceMax: isAtMax ? null : value,
    });
  }

  protected onDurationChange(value: number) {
    this.durationMax.set(value);
    const range = this.durationRange();
    const isAtMax = !range || value >= range[1];
    this.service.updateFilters({
      durationMaxMinutes: isAtMax ? null : value,
    });
  }

  protected isConnectionChecked(count: number): boolean {
    return this.service.filters().connections.includes(count);
  }

  protected onConnectionToggle(count: number, checked: boolean) {
    const current = this.service.filters().connections;
    const next = checked ? [...current, count] : current.filter((c) => c !== count);
    this.service.updateFilters({ connections: next });
  }

  protected connectionLabel(count: number): string {
    if (count === 0) return 'Direct';
    if (count === 1) return '1 stop';
    return `${count} stops`;
  }

  protected onReset() {
    this.service.resetFilters();
    const priceRange = this.priceRange();
    const durationRange = this.durationRange();
    if (priceRange) this.priceMax.set(priceRange[1]);
    if (durationRange) this.durationMax.set(durationRange[1]);
  }
}

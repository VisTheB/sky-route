import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiTextfield, TuiDataList } from '@taiga-ui/core';
import { TuiChevron, TuiSelect } from '@taiga-ui/kit';
import { SearchResultsService } from '../../search-results.service';
import { SortKey } from '../../../../core/models';

@Component({
  selector: 'app-search-results-sort-component',
  imports: [FormsModule, TuiTextfield, TuiChevron, TuiSelect, TuiDataList],
  templateUrl: './search-results-sort-component.html',
  styleUrl: './search-results-sort-component.scss',
})
export class SearchResultsSortComponent {
  protected service = inject(SearchResultsService);

  protected readonly options: { key: SortKey; label: string }[] = [
    { key: 'price-asc', label: 'Cheapest first' },
    { key: 'price-desc', label: 'Most expensive first' },
    { key: 'duration-asc', label: 'Shortest first' },
    { key: 'durations-desc', label: 'Longest first' },
  ];

  protected readonly stringify = (key: SortKey): string => {
    return this.options.find((o) => o.key === key)?.label ?? '';
  };

  protected onChange(key: SortKey) {
    this.service.setSort(key);
  }
}

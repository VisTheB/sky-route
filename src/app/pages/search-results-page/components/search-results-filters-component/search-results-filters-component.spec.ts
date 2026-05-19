import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsFiltersComponent } from './search-results-filters-component';

describe('SearchResultsFiltersComponent', () => {
  let component: SearchResultsFiltersComponent;
  let fixture: ComponentFixture<SearchResultsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

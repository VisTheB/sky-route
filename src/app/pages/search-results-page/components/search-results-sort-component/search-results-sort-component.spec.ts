import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsSortComponent } from './search-results-sort-component';

describe('SearchResultsSortComponent', () => {
  let component: SearchResultsSortComponent;
  let fixture: ComponentFixture<SearchResultsSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsSortComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

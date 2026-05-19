import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryGroupComponent } from './country-group-component';

describe('CountryGroupComponent', () => {
  let component: CountryGroupComponent;
  let fixture: ComponentFixture<CountryGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

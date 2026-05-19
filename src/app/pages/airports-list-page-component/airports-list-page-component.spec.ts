import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportsListPageComponent } from './airports-list-page-component';

describe('AirportsListPageComponent', () => {
  let component: AirportsListPageComponent;
  let fixture: ComponentFixture<AirportsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportsListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AirportsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

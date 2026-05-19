import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportDetailPageComponent } from './airport-detail-page-component';

describe('AirportDetailPageComponent', () => {
  let component: AirportDetailPageComponent;
  let fixture: ComponentFixture<AirportDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AirportDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

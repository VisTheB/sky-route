import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportScheduleComponent } from './airport-schedule-component';

describe('AirportScheduleComponent', () => {
  let component: AirportScheduleComponent;
  let fixture: ComponentFixture<AirportScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportScheduleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AirportScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

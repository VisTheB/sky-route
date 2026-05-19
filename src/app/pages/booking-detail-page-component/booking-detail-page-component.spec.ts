import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailPageComponent } from './booking-detail-page-component';

describe('BookingDetailPageComponent', () => {
  let component: BookingDetailPageComponent;
  let fixture: ComponentFixture<BookingDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

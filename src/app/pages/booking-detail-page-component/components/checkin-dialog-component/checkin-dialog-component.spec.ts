import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinDialogComponent } from './checkin-dialog-component';

describe('CheckinDialogComponent', () => {
  let component: CheckinDialogComponent;
  let fixture: ComponentFixture<CheckinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckinDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfliePageComponent } from './proflie-page-component';

describe('ProfliePageComponent', () => {
  let component: ProfliePageComponent;
  let fixture: ComponentFixture<ProfliePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfliePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfliePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

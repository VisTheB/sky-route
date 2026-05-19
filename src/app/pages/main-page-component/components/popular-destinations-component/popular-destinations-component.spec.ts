import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularDestinationsComponent } from './popular-destinations-component';
import { NowService } from '../../../../core/services';

describe('PopularDestinationsComponent', () => {
  let component: PopularDestinationsComponent;
  let fixture: ComponentFixture<PopularDestinationsComponent>;

  const nowServiceMock: Partial<NowService> = {
    getNow: () => Promise.resolve(new Date()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularDestinationsComponent],
      providers: [{ provide: NowService, useValue: nowServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PopularDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

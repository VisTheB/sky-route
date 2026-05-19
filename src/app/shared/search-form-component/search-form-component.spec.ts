import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SearchFormComponent } from './search-form-component';
import { NowService } from '../../core/services';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  const nowServiceMock: Partial<NowService> = {
    getNow: () => Promise.resolve(new Date()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent],
      providers: [provideRouter([]), { provide: NowService, useValue: nowServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

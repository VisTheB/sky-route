import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal, computed } from '@angular/core';

import { LayoutPage } from './layout-page';
import { AuthService } from '../../core/services';

describe('LayoutPage', () => {
  let component: LayoutPage;
  let fixture: ComponentFixture<LayoutPage>;

  const authServiceMock: Partial<AuthService> = {
    currentUser: signal(null),
    isLoading: signal(false),
    isAuthenticated: computed(() => false),
    userEmail: computed(() => null),
    userDisplayName: computed(() => null),
    userPhotoURL: computed(() => null),
    logout: () => Promise.resolve(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPage],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

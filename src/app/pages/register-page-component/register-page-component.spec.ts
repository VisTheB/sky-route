import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal, computed } from '@angular/core';

import { RegisterPageComponent } from './register-page-component';
import { AuthService } from '../../core/services';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  const authServiceMock: Partial<AuthService> = {
    currentUser: signal(null),
    isLoading: signal(false),
    isAuthenticated: computed(() => false),
    userEmail: computed(() => null),
    userDisplayName: computed(() => null),
    userPhotoURL: computed(() => null),
    registerWithEmail: () => Promise.resolve(null as never),
    loginWithGoogle: () => Promise.resolve(null as never),
    logout: () => Promise.resolve(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

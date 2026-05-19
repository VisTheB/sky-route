import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal, computed } from '@angular/core';

import { LoginPageComponent } from './login-page-component';
import { AuthService } from '../../core/services';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  const authServiceMock: Partial<AuthService> = {
    currentUser: signal(null),
    isLoading: signal(false),
    isAuthenticated: computed(() => false),
    userEmail: computed(() => null),
    userDisplayName: computed(() => null),
    userPhotoURL: computed(() => null),
    loginWithEmail: () => Promise.resolve(null as never),
    loginWithGoogle: () => Promise.resolve(null as never),
    logout: () => Promise.resolve(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

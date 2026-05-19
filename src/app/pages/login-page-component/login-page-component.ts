import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
import {
  TUI_VALIDATION_ERRORS,
  TuiButton,
  TuiError,
  TuiInput,
  TuiLabel,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { AuthService, AnalyticsService } from '../../core/services';

@Component({
  selector: 'app-login-page-component',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TuiButton,
    TuiLabel,
    TuiError,
    TuiInput,
    TuiTextfield,
    TuiCardLarge,
    TuiForm,
  ],
  templateUrl: './login-page-component.html',
  styleUrl: './login-page-component.scss',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: () => ({
        required: 'Required field',
        email: 'Invalid email format',
      }),
    },
  ],
})
export class LoginPageComponent {
  private auth = inject(AuthService);
  private analytics = inject(AnalyticsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.auth.loginWithEmail(email, password);
      this.analytics.authLogin('email');
      this.redirectAfterLogin();
    } catch (error) {
      this.errorMessage.set(this.getErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async loginWithGoogle() {
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      await this.auth.loginWithGoogle();
      this.analytics.authLogin('google');
      this.redirectAfterLogin();
    } catch (error) {
      this.errorMessage.set(this.getErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private redirectAfterLogin() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
    this.router.navigateByUrl(returnUrl);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          return 'Invalid email or password';
        case 'auth/too-many-requests':
          return 'Too many attempts. Please try again later';
        case 'auth/user-disabled':
          return 'Account is disabled';
        case 'auth/popup-closed-by-user':
          return 'Login window was closed';
        case 'auth/network-request-failed':
          return 'Network issues';
        default:
          return 'Failed to log in. Please try again';
      }
    }
    return 'An error occurred';
  }
}

import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
import {
  TuiButton,
  TuiError,
  TuiInput,
  TuiLabel,
  TuiTextfield,
  TUI_VALIDATION_ERRORS,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { AuthService, AnalyticsService } from '../../core/services';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password')?.value;
  if (password == null) return null;
  return password === control.value ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register-page-component',
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
  templateUrl: './register-page-component.html',
  styleUrl: './register-page-component.scss',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: () => ({
        required: 'Required field',
        email: 'Invalid email format',
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          signal(`Minimum length - <b>${requiredLength} characters</b>`),
        passwordsMismatch: 'Passwords do not match',
      }),
    },
  ],
})
export class RegisterPageComponent {
  private auth = inject(AuthService);
  private analytics = inject(AnalyticsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.regForm.controls.password.valueChanges.subscribe(() => {
      this.regForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  regForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, passwordsMatch]],
  });

  async onSubmit() {
    this.regForm.markAllAsTouched();
    if (this.regForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.regForm.getRawValue();

    try {
      await this.auth.registerWithEmail(email, password);
      this.analytics.authSignup('email');
      this.redirectAfterReg();
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
      this.analytics.authSignup('google');
      this.redirectAfterReg();
    } catch (error) {
      this.errorMessage.set(this.getErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private redirectAfterReg() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
    this.router.navigateByUrl(returnUrl);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/credential-already-in-use':
        case 'auth/email-already-in-use':
        case 'auth/account-exists-with-different-credential':
          return 'Account with this email already exists';
        case 'auth/too-many-requests':
          return 'Too many attempts. Please try again later';
        case 'auth/user-disabled':
          return 'Account is disabled';
        case 'auth/popup-closed-by-user':
          return 'Login window was closed before completing the sign in';
        case 'auth/network-request-failed':
          return 'Problems with the network. Please check your connection and try again';
        default:
          return 'Failed to sign in. Please try again later';
      }
    }
    return 'An error occurred';
  }
}

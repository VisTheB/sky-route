import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  TUI_VALIDATION_ERRORS,
  TuiButton,
  TuiError,
  TuiLabel,
  TuiTextfield,
  TuiInput,
  TuiNotificationService,
  TuiDataList,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { TuiInputDate } from '@taiga-ui/kit';
import { TuiDay } from '@taiga-ui/cdk';

import { passportNumberValidator } from '../../shared';
import { PassportData } from '../../core/models';
import { AuthService, ProfileService } from '../../core/services';

@Component({
  selector: 'app-proflie-page-component',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiLabel,
    TuiError,
    TuiInput,
    TuiTextfield,
    TuiCardLarge,
    TuiForm,
    TuiInputDate,
    TuiDataList,
  ],
  templateUrl: './proflie-page-component.html',
  styleUrl: './proflie-page-component.scss',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: () => ({
        required: 'Required field',
        minlength: ({ requiredLength }: { requiredLength: number }) =>
          signal(`Minimum length - <b>${requiredLength} characters</b>`),
        passportFormat: 'Format: 4 digits + 6 digits, e.g. 1234 567890',
        pattern: 'Invalid format',
      }),
    },
  ],
})
export class ProfliePageComponent {
  protected readonly notifications = inject(TuiNotificationService);
  private auth = inject(AuthService);
  protected profileService = inject(ProfileService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isSubmitting = signal(false);

  protected createdAtFormatted = computed(() => {
    const profile = this.profileService.profile();
    if (!profile?.createdAt) return '';

    const timestamp = profile.createdAt;
    if (typeof timestamp.toDate !== 'function') return '';

    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  });

  protected email = computed(
    () => this.profileService.profile()?.email ?? this.auth.userEmail() ?? '',
  );

  passportForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    middleName: [''],
    birthDate: this.fb.control<TuiDay | null>(null, { validators: [Validators.required] }),
    passportNumber: ['', [Validators.required, passportNumberValidator]],
  });

  constructor() {
    effect(() => {
      const passport = this.profileService.profile()?.passport;
      if (passport) {
        this.passportForm.patchValue(
          {
            firstName: passport.firstName,
            lastName: passport.lastName,
            middleName: passport.middleName,
            birthDate: passport.birthDate
              ? TuiDay.normalizeParse(passport.birthDate, 'yyyy/mm/dd')
              : null,
            passportNumber: passport.passportNumber,
          },
          { emitEvent: false },
        );
      }
    });
  }

  async onSave() {
    this.passportForm.markAllAsTouched();
    if (this.passportForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    try {
      const value = this.passportForm.getRawValue();
      const passport: PassportData = {
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        middleName: value.middleName.trim(),
        birthDate: value.birthDate?.toJSON() ?? '',
        passportNumber: value.passportNumber.replace(/\s+/g, ''),
      };

      await this.profileService.updatePassport(passport);
      this.notifications
        .open('Passport updated successfully!', { label: 'Success', autoClose: 3000 })
        .subscribe();
    } catch (error) {
      console.error('Failed to save passport', error);
      this.notifications
        .open('Failed to save passport. Please try again.', {
          label: 'Error',
          autoClose: 3000,
        })
        .subscribe();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onLogout() {
    try {
      await this.auth.logout();
      this.router.navigate(['/']);
    } catch (error) {
      this.notifications
        .open('Failed to logout. Please try again.', { label: 'Error', autoClose: 3000 })
        .subscribe();
      console.error('Logout failed', error);
    }
  }
}

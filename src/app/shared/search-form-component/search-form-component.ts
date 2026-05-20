import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  TUI_VALIDATION_ERRORS,
  TuiButton,
  TuiError,
  TuiTextfield,
  TuiLabel,
  TuiDataList,
  TuiInput,
} from '@taiga-ui/core';
import { TuiForm } from '@taiga-ui/layout';
import { TuiDay, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiInputDate, TuiChevron, TuiSelect } from '@taiga-ui/kit';
import { NowService } from '../../core/services';
import {
  FareConditions,
  FARE_CONDITIONS_LABELS,
  MAX_CONNECTIONS_VALUES,
  MAX_CONNECTIONS_LABELS,
  MaxConnectionsParam,
} from '../../core/models';

@Component({
  selector: 'app-search-form-component',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiError,
    TuiTextfield,
    TuiInput,
    TuiLabel,
    TuiForm,
    TuiInputDate,
    TuiDataList,
    TuiChevron,
    TuiSelect,
  ],
  templateUrl: './search-form-component.html',
  styleUrl: './search-form-component.scss',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: () => ({
        required: 'Required field',
        minlength: 'Too short',
      }),
    },
  ],
})
export class SearchFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private nowService = inject(NowService);

  minDate = signal<TuiDay | null>(null);
  maxDate = signal<TuiDay | null>(null);
  isSubmitting = signal(false);

  readonly fareConditions = Object.values(FareConditions);
  readonly maxConnectionsOptions = MAX_CONNECTIONS_VALUES;

  readonly fareLabels = FARE_CONDITIONS_LABELS;
  readonly connectionsLabels = MAX_CONNECTIONS_LABELS;

  searchForm = this.fb.nonNullable.group({
    from: ['', [Validators.required, Validators.minLength(1)]],
    to: ['', [Validators.required, Validators.minLength(1)]],
    date: this.fb.control<TuiDay | null>(null, { validators: [Validators.required] }),
    class: this.fb.control<FareConditions>(FareConditions.Economy, {
      validators: [Validators.required],
    }),
    max_connections: this.fb.control<MaxConnectionsParam>('unbound', {
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.preloadNow();
  }

  async onDateFocus() {
    if (this.minDate()) return;
    await this.preloadNow();
  }

  private async preloadNow() {
    try {
      const now = await this.nowService.getNow();
      const day = TuiDay.fromLocalNativeDate(now);
      this.minDate.set(day);
      this.maxDate.set(day.append({ day: 60 }));
    } catch (error) {
      console.error('Failed to fetch /now', error);
      const fallback = TuiDay.currentLocal();
      this.minDate.set(fallback);
      this.maxDate.set(fallback.append({ day: 60 }));
    }
  }

  onSubmit() {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const value = this.searchForm.getRawValue();
    const dateStr = value.date!.toJSON();

    this.router.navigate(['routes', 'search'], {
      queryParams: {
        from: value.from.trim(),
        to: value.to.trim(),
        date: dateStr,
        class: value.class,
        max_connections: value.max_connections,
      },
    });
    this.isSubmitting.set(false);
  }

  readonly stringifyFare: TuiStringHandler<FareConditions> = (value) =>
    this.fareLabels[value] ?? '';

  readonly stringifyConnections: TuiStringHandler<MaxConnectionsParam> = (value) =>
    this.connectionsLabels[value] ?? '';
}

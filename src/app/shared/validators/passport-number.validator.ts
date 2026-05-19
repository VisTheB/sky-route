import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Проверяет формат серии и номера паспорта РФ.
export const passportNumberValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;

  const cleaned = String(value).replace(/\s/g, '');
  const isValid = /^\d{10}$/.test(cleaned);

  return isValid ? null : { passportFormat: true };
};

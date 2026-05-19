import { Timestamp } from '@angular/fire/firestore';

export type PassportData = {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  passportNumber: string;
};

export type UserProfile = {
  email: string;
  createdAt: Timestamp | null;
  passport: PassportData | null;
};

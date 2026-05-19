import { Injectable, inject, signal, computed, effect } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  getDoc,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { PassportData, UserProfile } from '../models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  readonly profile = signal<UserProfile | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly hasPassportData = computed(() => this.profile()?.passport !== null);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        void this.loadProfile(user.uid);
      } else {
        this.profile.set(null);
        this.error.set(null);
      }
    });
  }

  private async loadProfile(uid: string) {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const docRef = doc(this.firestore, 'users', uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        this.profile.set(snapshot.data() as UserProfile);
      } else {
        await this.createInitialProfile(uid);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
      this.error.set('Failed to load profile');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async createInitialProfile(uid: string) {
    const user = this.auth.currentUser();
    if (!user) return;

    const initial: Partial<UserProfile> = {
      email: user.email ?? '',
      createdAt: serverTimestamp() as unknown as Timestamp,
      passport: null,
    };

    const docRef = doc(this.firestore, 'users', uid);
    await setDoc(docRef, initial);

    const data = await getDoc(docRef);
    this.profile.set(data.data() as UserProfile);
  }

  async updatePassport(passport: PassportData): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) throw new Error('Not authenticated');

    const docRef = doc(this.firestore, 'users', user.uid);
    await updateDoc(docRef, { passport });

    this.profile.update((current) => (current ? { ...current, passport } : null));
  }
}

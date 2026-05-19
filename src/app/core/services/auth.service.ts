import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  currentUser = signal<User | null>(null);
  isLoading = signal(true);

  isAuthenticated = computed(() => this.currentUser() !== null);
  userEmail = computed(() => this.currentUser()?.email ?? null);
  userDisplayName = computed(() => this.currentUser()?.displayName ?? null);
  userPhotoURL = computed(() => this.currentUser()?.photoURL ?? null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.isLoading.set(false);
    });
  }

  async registerWithEmail(email: string, password: string, displayName?: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    return credential.user;
  }
  async loginWithEmail(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    return credential.user;
  }
  async logout() {
    await signOut(this.auth);
  }
  async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }
  async getIdToken(): Promise<string | null> {
    const user = this.currentUser();
    if (!user) return null;
    return await user.getIdToken();
  }
}

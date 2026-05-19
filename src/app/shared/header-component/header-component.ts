import { Component, inject, signal } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { AuthService } from '../../core/services';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [TuiButton, RouterLinkActive, RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  auth = inject(AuthService);
  router = inject(Router);
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  async logout() {
    this.closeMenu();
    await this.auth.logout();
    this.router.navigate(['/']);
  }
}

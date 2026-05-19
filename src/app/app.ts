/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */
import { TuiRoot } from '@taiga-ui/core';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

declare const ym: any;

window.addEventListener('error', (event) => {
  if (event.filename?.includes('mc.yandex.ru')) {
    event.stopImmediatePropagation();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.stack?.includes('mc.yandex.ru')) {
    event.preventDefault();
  }
});

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('sky-route');
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        ym(109305966, 'hit', event.urlAfterRedirects);
      }
    });
  }
}

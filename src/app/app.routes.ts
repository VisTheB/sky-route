import { Routes } from '@angular/router';
import { MainPageComponent, LayoutPage, NotFoundPageComponent } from './pages';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page-component/login-page-component').then((m) => m.LoginPageComponent),
    title: 'Вход',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page-component/register-page-component').then(
        (m) => m.RegisterPageComponent,
      ),
    title: 'Регистрация',
  },
  {
    path: '',
    component: LayoutPage,
    children: [
      {
        path: 'main',
        component: MainPageComponent,
        title: 'Главная',
      },
      {
        path: 'routes/search',
        loadComponent: () =>
          import('./pages/search-results-page/search-results-page-component').then(
            (m) => m.SearchResultsPageComponent,
          ),
        title: 'Поиск рейсов',
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/proflie-page-component/proflie-page-component').then(
            (m) => m.ProfliePageComponent,
          ),
        title: 'Профиль',
      },
      {
        path: 'bookings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/booking-list-page-component/booking-list-page-component').then(
            (m) => m.BookingListPageComponent,
          ),
        title: 'Мои бронирования',
      },
      {
        path: 'bookings/:ref',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/booking-detail-page-component/booking-detail-page-component').then(
            (m) => m.BookingDetailPageComponent,
          ),
        title: 'Детали бронирования',
      },
      {
        path: 'airports',
        loadComponent: () =>
          import('./pages/airports-list-page-component/airports-list-page-component').then(
            (m) => m.AirportsListPageComponent,
          ),
        title: 'Аэропорты',
      },
      {
        path: 'airports/:code',
        loadComponent: () =>
          import('./pages/airport-detail-page-component/airport-detail-page-component').then(
            (m) => m.AirportDetailPageComponent,
          ),
        title: 'Аэропорт',
      },
    ],
  },
  { path: '**', component: NotFoundPageComponent },
];

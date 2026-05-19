import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { hawkTrackerDsn } from './environments/environment';

Sentry.init({
  dsn: hawkTrackerDsn,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', 'sky-route.relaxdev.ru'],
  sendDefaultPii: false,
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

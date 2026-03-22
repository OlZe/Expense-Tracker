import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  Type,
  isDevMode,
} from '@angular/core';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { routes } from './app.routes';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideStore } from '@ngxs/store';
import { ExpensesState } from './state/expenses/expenses.state';
import { HomePage } from './views/home-page/home-page';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideStore(
      [ExpensesState],
      withNgxsStoragePlugin({ keys: '*' }),
      withNgxsReduxDevtoolsPlugin({ disabled: !isDevMode() }),
    ),
    provideLuxonDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

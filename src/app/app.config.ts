import { ApplicationConfig, provideBrowserGlobalErrorListeners, Type } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideStore } from '@ngxs/store';
import { ExpensesState } from './state/expenses/expenses.state';
import { HomePage } from './views/home-page/home-page';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideStore(
      [ExpensesState],
      withNgxsStoragePlugin({ keys: '*' }),
      withNgxsReduxDevtoolsPlugin(),
    ),
  ],
};

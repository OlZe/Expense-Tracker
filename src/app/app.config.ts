import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideStore } from '@ngxs/store';
import { CategoriesState } from './state/categories/categories.state';
import { ExpensesState } from './state/expenses/expenses.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(
      [CategoriesState, ExpensesState],
      withNgxsStoragePlugin({ keys: '*' }),
      withNgxsReduxDevtoolsPlugin(),
    ),
  ],
};

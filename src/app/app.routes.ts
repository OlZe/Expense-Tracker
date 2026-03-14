import { Routes } from '@angular/router';
import { CategoryCardCreateNew } from './components/categories/category-card-create-new/category-card-create-new';
import { HomePage } from './views/home-page/home-page';
import { CategoryPage } from './views/category-page/category-page';

export const routes: Routes = [
  { path: 'category/:id', component: CategoryPage },
  { path: '', pathMatch: 'full', component: HomePage },
  { path: '**', redirectTo: '' },
];

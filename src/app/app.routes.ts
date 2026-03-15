import { Routes } from '@angular/router';
import { HomePage } from './views/home-page/home-page';
import { CategoryPage } from './views/category-page/category-page';
import { EditCategoryDialog as EditCategoryPage } from './views/category-page/edit/edit-category-page';
import { NewCategoryPage } from './views/new-category-page/new-category-page';
import { ExpensePage } from './views/expense-page/expense-page';
import { EditExpensePage } from './views/expense-page/edit-expense-page/edit-expense-page';

export const routes: Routes = [
  { path: 'category/new', component: NewCategoryPage },
  { path: 'category/:id', component: CategoryPage },
  { path: 'category/:id/edit', component: EditCategoryPage },
  { path: 'expense/:id', component: ExpensePage },
  { path: 'expense/:id/edit', component: EditExpensePage },
  { path: '', pathMatch: 'full', component: HomePage },
  { path: '**', redirectTo: '' },
];

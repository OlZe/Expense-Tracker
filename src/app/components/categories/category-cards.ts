import { Component, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { CategoryCard } from './category-card/category-card';
import { CategoryCardCreateNew } from './category-card-create-new/category-card-create-new';
import { Category } from '../../state/expenses/expenses.model';
import { ExpensesState } from '../../state/expenses/expenses.state';

@Component({
  standalone: true,
  templateUrl: './category-cards.html',
  imports: [CategoryCard, CategoryCardCreateNew],
  selector: 'category-cards',
})
export class CategoryCards {
  categories: Signal<Category[]>;

  constructor(store: Store) {
    this.categories = store.selectSignal(ExpensesState.getCategories);
  }
}

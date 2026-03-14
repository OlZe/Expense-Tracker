import { Component, computed, inject, input, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CategoriesState } from '../../state/categories/categories.state';
import { Category } from '../../state/categories/categories.model';
import { MoneyInput } from '../../components/money-input/money-input';
import { MatButtonModule } from '@angular/material/button';
import { ExpensesActions } from '../../state/expenses/expenses.action';

@Component({
  standalone: true,
  templateUrl: './category-page.html',
  imports: [MoneyInput, MatButtonModule],
})
export class CategoryPage {
  category!: Category;
  moneyInput = signal(0);
  createExpenseButtonDisabled = computed(() => this.moneyInput() <= 0);

  constructor(
    private store: Store,
    private router: Router,
    route: ActivatedRoute,
  ) {
    const id = route.snapshot.paramMap.get('id');
    if (!id) {
      router.navigateByUrl('/');
      return;
    }
    const category = store.selectSnapshot(CategoriesState.getCategoryById(id));
    if (!category) {
      router.navigateByUrl('/');
      return;
    }
    this.category = category;
  }

  onMoneyInput(inputNum: number) {
    this.moneyInput.set(inputNum);
  }

  onSaveExpenseButton() {
    if (this.createExpenseButtonDisabled()) {
      return;
    }

    this.store.dispatch(new ExpensesActions.Add(new Date(), this.moneyInput(), this.category.id));
    this.router.navigateByUrl('/');
  }
}

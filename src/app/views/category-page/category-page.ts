import { Component, computed, DestroyRef, inject, input, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { MoneyInput } from '../../components/money-input/money-input';
import { MatButtonModule } from '@angular/material/button';
import { ExpensesActions } from '../../state/expenses/expenses.action';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';
import { Category, Expense, ExpenseWithCategory } from '../../state/expenses/expenses.model';
import { ExpensesState } from '../../state/expenses/expenses.state';
import { Expenses } from '../../components/expenses/expenses';
import { takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  templateUrl: './category-page.html',
  imports: [MoneyInput, MatButtonModule, MatIconModule, RouterLink, Expenses],
})
export class CategoryPage {
  category!: Category;
  moneyInput = signal(0);
  createExpenseButtonDisabled = computed(() => this.moneyInput() <= 0);
  associatedExpenses!: ExpenseWithCategory[];

  constructor(
    private store: Store,
    private router: Router,
    private snackbarService: SnackbarService,
    private destroyRef: DestroyRef,
    route: ActivatedRoute,
  ) {
    const id = route.snapshot.paramMap.get('id');
    if (!id) {
      router.navigateByUrl('/');
      return;
    }
    const category = store.selectSnapshot(ExpensesState.getCategoryById(id));
    if (!category) {
      router.navigateByUrl('/');
      return;
    }
    this.category = category;
    this.associatedExpenses = store
      .selectSnapshot(ExpensesState.getExpensesWithCategory)
      .filter((e) => e.categoryId === category.id);
  }

  onMoneyInput(inputNum: number) {
    this.moneyInput.set(inputNum);
  }

  onSaveExpenseButton() {
    if (this.createExpenseButtonDisabled()) {
      return;
    }

    this.store
      .dispatch(new ExpensesActions.Add(new Date(), this.moneyInput(), this.category.id))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
          this.snackbarService.show('Expense created.');
        },
        error: (message) => {
          this.snackbarService.error(message);
        },
      });
  }
}

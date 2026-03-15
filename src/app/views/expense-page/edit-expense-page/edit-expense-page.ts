import { Component, DestroyRef } from '@angular/core';
import { MoneyInput } from '../../../components/money-input/money-input';
import { Category, Expense, ExpenseWithCategory } from '../../../state/expenses/expenses.model';
import { Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { ExpensesState } from '../../../state/expenses/expenses.state';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatInput, MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ExpensesActions } from '../../../state/expenses/expenses.action';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  imports: [
    MoneyInput,
    MatFormFieldModule,
    MatDatepickerModule,
    MatTimepickerModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './edit-expense-page.html',
})
export class EditExpensePage {
  expense!: Expense;
  datetime!: Date;
  allCategories!: Category[];
  deleteConfirmed = false;

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
    const expense = store.selectSnapshot(ExpensesState.getExpensesWithCategoryById(id));
    if (!expense) {
      router.navigateByUrl('/');
      return;
    }
    this.expense = expense;
    this.datetime = new Date(this.expense.datetime);
    this.allCategories = store.selectSnapshot(ExpensesState.getCategories);
  }

  changePrice(newPrice: number) {
    this.expense.price = newPrice;
  }

  saveExpense() {
    const newExpense: Expense = {
      id: this.expense.id,
      price: this.expense.price,
      datetime: this.datetime.toISOString(),
      categoryId: this.expense.categoryId,
    };

    this.store
      .dispatch(new ExpensesActions.Edit(newExpense))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbarService.show('Expense edited.');
          this.router.navigate(['expense', this.expense.id]);
        },
        error: (message) => {
          this.snackbarService.error(message);
        },
      });
  }

  deleteExpense() {
    if (!this.deleteConfirmed) {
      return;
    }

    this.store
      .dispatch(new ExpensesActions.Delete(this.expense.id))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbarService.show('Expense deleted.');
          this.router.navigateByUrl('/');
        },
        error: (message) => {
          this.snackbarService.error(message);
        },
      });
  }
}

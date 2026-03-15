import { Component, DestroyRef, inject } from '@angular/core';
import { Expense, ExpenseWithCategory } from '../../state/expenses/expenses.model';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { SnackbarService } from '../../services/snackbar.service';
import { ExpensesState } from '../../state/expenses/expenses.state';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [RouterLink, MatIconModule],
  standalone: true,
  templateUrl: './expense-page.html',
})
export class ExpensePage {
  expense!: ExpenseWithCategory;
  euros!: string;
  cents!: string;
  date!: string;

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

    const priceFormatter = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const priceString = priceFormatter.format(expense.price);
    [this.euros, this.cents] = priceString.split(',');

    const dateFormatter = Intl.DateTimeFormat('de-DE', { dateStyle: 'full', timeStyle: 'medium' });
    this.date = dateFormatter.format(new Date(expense.datetime));
  }
}

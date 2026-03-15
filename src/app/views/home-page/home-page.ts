import { Component, inject } from '@angular/core';
import { Graph } from '../../components/graph/graph';
import { CategoryCards } from '../../components/categories/category-cards';
import { Expenses } from '../../components/expenses/expenses';
import { Store } from '@ngxs/store';
import { ExpensesState } from '../../state/expenses/expenses.state';

@Component({
  standalone: true,
  templateUrl: './home-page.html',
  imports: [Graph, CategoryCards, Expenses],
})
export class HomePage {
  allExpenses = inject(Store).selectSignal(ExpensesState.getExpensesWithCategory);
}

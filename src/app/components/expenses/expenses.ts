import { Component, computed, input, Signal } from '@angular/core';
import { ExpenseWithCategory } from '../../state/expenses/expenses.model';
import { EuroPipe } from '../../pipes/EuroPipe';
import { RouterModule } from '@angular/router';

type TimeRange = 'today' | 'yesterday' | 'last 7 days' | 'last 30 days' | 'older';

@Component({
  templateUrl: 'expenses.html',
  imports: [EuroPipe, RouterModule],
  selector: 'expenses',
})
export class Expenses {
  emptyMessage = input<string>('No expenses.');
  expenses = input.required<ExpenseWithCategory[]>();
  orderedExpenses: Signal<Map<TimeRange, ExpenseWithCategory[]>> = computed(() => {
    let orderedExpenses = new Map<TimeRange, ExpenseWithCategory[]>();

    for (const expense of this.expenses().slice().sort().reverse()) {
      const key = this.getTimeRange(new Date(expense.datetime));
      let value = orderedExpenses.get(key) ?? [];
      value.push(expense);
      orderedExpenses.set(key, value);
    }

    return orderedExpenses;
  });
  expensesSumByTimerange = computed(() => {
    let expensesSumByTimerange = new Map<TimeRange, number>();

    for (const [timerange, expenses] of this.orderedExpenses().entries()) {
      const sum = expenses.reduce((sum, expense) => sum + expense.price, 0);
      expensesSumByTimerange.set(timerange, sum);
    }
    return expensesSumByTimerange;
  });

  private getTimeRange(date: Date): TimeRange {
    const today = new Date().setHours(0, 0, 0, 0);
    const d = new Date(date).setHours(0, 0, 0, 0);
    const diffInDays = (today - d) / 86400000;

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays <= 7) return 'last 7 days';
    if (diffInDays <= 30) return 'last 30 days';
    return 'older';
  }
}

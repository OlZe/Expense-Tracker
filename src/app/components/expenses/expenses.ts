import { Component, computed, input, Signal } from '@angular/core';
import { ExpenseWithCategory } from '../../state/expenses/expenses.model';
import { EuroPipe } from '../../pipes/EuroPipe';
import { RouterModule } from '@angular/router';

type TimeRange = string;

@Component({
  templateUrl: 'expenses.html',
  imports: [EuroPipe, RouterModule],
  selector: 'expenses',
})
export class Expenses {
  emptyMessage = input<string>('No expenses.');
  expenses = input.required<ExpenseWithCategory[]>();
  orderedExpensesByTimerange: Signal<Map<TimeRange, ExpenseWithCategory[]>> = computed(() => {
    let orderedExpensesByTimerange = new Map<TimeRange, ExpenseWithCategory[]>();
    const orderedExpenses = this.expenses()
      .slice()
      .sort((a, b) => b.datetime.localeCompare(a.datetime));
    for (const expense of orderedExpenses) {
      const key = this.getTimeRange(new Date(expense.datetime));
      let value = orderedExpensesByTimerange.get(key) ?? [];
      value.push(expense);
      orderedExpensesByTimerange.set(key, value);
    }

    return orderedExpensesByTimerange;
  });
  expensesSumByTimerange = computed(() => {
    let expensesSumByTimerange = new Map<TimeRange, number>();

    for (const [timerange, expenses] of this.orderedExpensesByTimerange().entries()) {
      const sum = expenses.reduce((sum, expense) => sum + expense.price, 0);
      expensesSumByTimerange.set(timerange, sum);
    }
    return expensesSumByTimerange;
  });

  private getTimeRange(date: Date): TimeRange {
    const today = new Date();

    if(date.getTime() > today.getTime()) {
      return 'future';
    }

    if (date.getFullYear() !== today.getFullYear()) {
      // Different year => Return format: <month year>
      return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }

    if (date.getMonth() !== today.getMonth()) {
      // Different month => Return format: <month>
      return date.toLocaleDateString(undefined, { month: 'long' });
    }

    // Same month => return 'today' | 'yesterday' | 'last 7 days in this month' | '<month>'
    const daysDelta = today.getDate() - date.getDate();
    if (daysDelta === 0) return 'today';
    if (daysDelta === 1) return 'yesterday';
    if (daysDelta <= 7) return 'last 7 days in this month';
    return date.toLocaleDateString(undefined, { month: 'long' });
  }
}

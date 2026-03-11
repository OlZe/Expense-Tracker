import { Component, computed, Signal } from "@angular/core";
import { Store } from "@ngxs/store";
import { ExpensesState } from "../../state/expenses/expenses.state";
import { ExpenseWithCategory } from "../../state/expenses/expenses.model";

@Component({
  templateUrl: 'expenses.html',
  imports: [],
  selector: 'expenses'
})
export class Expenses {
  orderedExpenses: Signal<ExpenseWithCategory[]>;

  constructor(store: Store) {
    const expenses = store.selectSignal(ExpensesState.getExpensesWithCategory)
    this.orderedExpenses = computed(() => {
      return expenses().slice().sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
    })
  }
}
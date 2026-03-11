import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Expense, ExpensesStateModel } from "./expenses.model";
import { ExpensesActions } from "./expenses.action";
import { CategoriesStateModel, Category } from "../categories/categories.model";
import { CategoriesState } from "../categories/categories.state";

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
    expenses: [
      {
        id: '1',
        categoryId: 'transport',
        datetime: new Date(2026, 2, 11, 9, 17),
        price: 2.75
      },
      {
        id: '2',
        categoryId: 'transport',
        datetime: new Date(2026, 2, 11, 17, 32),
        price: 2.75
      },
      {
        id: '3',
        categoryId: 'food',
        datetime: new Date(2026, 2, 11, 18, 30),
        price: 7.90
      }
    ]
  }
})
@Injectable()
export class ExpensesState {
  @Selector()
  static getExpenses(state: ExpensesStateModel) {
    return state.expenses;
  }

  @Selector()
  static getExpenseById(state: ExpensesStateModel) {
    return (id: string) => {
      return state.expenses.find((c) => c.id === id);
    }
  }

  @Selector([ExpensesState, CategoriesState])
  static getExpensesWithCategory(expensesState: ExpensesStateModel, categoriesState: CategoriesStateModel) {
    // convert categories array to a lookup
    const categoriesById: Record<string, Category> = {};
    categoriesState.categories.forEach(cat => {
      categoriesById[cat.id] = cat;
    });

    return expensesState.expenses.map(expense => ({
      ...expense,
      category: expense.categoryId ? categoriesById[expense.categoryId] : undefined
    }));
  }

  @Selector([ExpensesState, CategoriesState])
  static getExpenseWithCategoryById(expensesState: ExpensesStateModel, categoriesState: CategoriesStateModel) {
    return (id: string) => {
      const expense = expensesState.expenses.find((e) => e.id === id);
      if (!expense) return undefined;
      const category = expense.categoryId ? categoriesState.categories.find((c) => c.id === expense.categoryId) : undefined
      return {
        ...expense,
        category: category
      }
    }

  }

  @Action(ExpensesActions.Add)
  addExpense(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Add) {
    const state = ctx.getState();

    ctx.patchState({
      expenses: [
        ...state.expenses,
        {
          id: crypto.randomUUID(),
          ...action
        }
      ]
    })
  }

  @Action(ExpensesActions.Edit)
  editExpenses(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Edit) {
    const state = ctx.getState();

    const index = state.expenses.findIndex((c) => c.id === action.expense.id);
    if (index < 0) throw new Error(`Expense ${action.expense.id} doesn't exist.`)


    ctx.patchState({
      expenses: [
        ...state.expenses.slice(0, index),
        {
          ...state.expenses[index],
          ...action.expense,
        },
        ...state.expenses.slice(index + 1)
      ]
    });
  }

  @Action(ExpensesActions.Delete)
  deleteExpense(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Delete) {
    const state = ctx.getState();

    const index = state.expenses.findIndex((c) => c.id === action.id);
    if (index < 0) throw new Error(`Expense ${action.id} doesn't exist.`);

    ctx.patchState({
      expenses: [
        ...state.expenses.slice(0, index),
        ...state.expenses.slice(index + 1)
      ]
    })
  }
}
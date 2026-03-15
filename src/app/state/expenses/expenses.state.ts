import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { Expense, ExpensesStateModel, ExpenseWithCategory } from './expenses.model';
import { ExpensesActions } from './expenses.action';
import { CategoriesStateModel, Category } from '../categories/categories.model';
import { CategoriesState } from '../categories/categories.state';
import { CategoryActions } from '../categories/categories.action';

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
    expenses: [
      {
        id: 'default-1',
        categoryId: 'default-transport',
        datetime: new Date(),
        price: 2.75,
      },
      {
        id: 'default-2',
        categoryId: 'default-transport',
        datetime: new Date(),
        price: 2.75,
      },
      {
        id: 'default-3',
        categoryId: 'default-food',
        datetime: new Date(),
        price: 7.9,
      },
    ],
  },
})
@Injectable()
export class ExpensesState {
  @Selector()
  static getExpenses(state: ExpensesStateModel) {
    return state.expenses;
  }

  static getExpenseById(id: string) {
    return createSelector([ExpensesState], (state: ExpensesStateModel) => {
      return state.expenses.find((c) => c.id === id);
    });
  }

  @Selector([ExpensesState, CategoriesState])
  static getExpensesWithCategory(
    expensesState: ExpensesStateModel,
    categoriesState: CategoriesStateModel,
  ) {
    // convert categories array to a lookup
    const categoriesById: Record<string, Category> = {};
    categoriesState.categories.forEach((cat) => {
      categoriesById[cat.id] = cat;
    });

    return expensesState.expenses.map(
      (expense) =>
        ({
          ...expense,
          category: expense.categoryId ? categoriesById[expense.categoryId] : undefined,
        }) as ExpenseWithCategory,
    );
  }

  static getExpenseWithCategoryById(id: string) {
    return createSelector(
      [ExpensesState, CategoriesState],
      (expensesState: ExpensesStateModel, categoriesState: CategoriesStateModel) => {
        const expense = expensesState.expenses.find((e) => e.id === id);
        if (!expense) return undefined;
        const category = expense.categoryId
          ? categoriesState.categories.find((c) => c.id === expense.categoryId)
          : undefined;
        return {
          ...expense,
          category: category,
        } as ExpenseWithCategory;
      },
    );
  }

  @Action(ExpensesActions.Add)
  addExpense(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Add) {
    const state = ctx.getState();

    ctx.patchState({
      expenses: [
        ...state.expenses,
        {
          id: crypto.randomUUID(),
          ...action,
        },
      ],
    });
  }

  @Action(ExpensesActions.Edit)
  editExpenses(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Edit) {
    const state = ctx.getState();

    const index = state.expenses.findIndex((c) => c.id === action.expense.id);
    if (index < 0) throw new Error(`Expense ${action.expense.id} doesn't exist.`);

    ctx.patchState({
      expenses: [
        ...state.expenses.slice(0, index),
        {
          ...state.expenses[index],
          ...action.expense,
        },
        ...state.expenses.slice(index + 1),
      ],
    });
  }

  @Action(ExpensesActions.Delete)
  deleteExpense(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Delete) {
    const state = ctx.getState();

    const index = state.expenses.findIndex((c) => c.id === action.id);
    if (index < 0) throw new Error(`Expense ${action.id} doesn't exist.`);

    ctx.patchState({
      expenses: [...state.expenses.slice(0, index), ...state.expenses.slice(index + 1)],
    });
  }

  @Action(CategoryActions.Delete)
  deleteCategory(ctx: StateContext<ExpensesStateModel>, action: CategoryActions.Delete) {
    const state = ctx.getState();

    let newExpenses: Expense[];
    if (action.deleteAllAssociatedExpenses) {
      // Remove associated expenses
      newExpenses = state.expenses.filter((e) => e.categoryId !== action.id);
    } else {
      // remove category-id on associated expenses
      newExpenses = state.expenses.map((e) =>
        e.categoryId === action.id ? { ...e, categoryId: undefined } : e,
      );
    }

    ctx.patchState({
      expenses: newExpenses,
    });
  }
}

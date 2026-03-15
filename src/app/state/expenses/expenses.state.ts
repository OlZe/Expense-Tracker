import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { Category, Expense, ExpensesStateModel, ExpenseWithCategory } from './expenses.model';
import { CategoryActions, ExpensesActions } from './expenses.action';

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
    expenses: {
      'default-1': {
        id: 'default-1',
        categoryId: 'default-transport',
        datetime: new Date(),
        price: 2.75,
      },
      'default-2': {
        id: 'default-2',
        categoryId: 'default-transport',
        datetime: new Date(),
        price: 2.75,
      },
      'default-3': {
        id: 'default-3',
        categoryId: 'default-food',
        datetime: new Date(),
        price: 7.9,
      },
    },
    categories: {
      'default-transport': {
        id: 'default-transport',
        name: '🚗 Transport',
      },
      'default-health': {
        id: 'default-health',
        name: '❤️‍🩹 Health',
      },
      'default-food': {
        id: 'default-food',
        name: '🍽️ Food & Drinks',
      },
    },
  },
})
@Injectable()
export class ExpensesState {
  @Selector()
  static getExpensesWithCategory(state: ExpensesStateModel) {
    console.log(state);
    return Object.values(state.expenses).map(
      (expense) =>
        ({
          ...expense,
          category: expense.categoryId ? state.categories[expense.categoryId] : null,
        }) as ExpenseWithCategory,
    );
  }

  @Selector()
  static getCategories(state: ExpensesStateModel) {
    return Object.values(state.categories);
  }

  static getCategoryById(id: string) {
    return createSelector([ExpensesState], (state: ExpensesStateModel) => {
      return state.categories[id];
    });
  }

  @Selector()
  static getCategorylessExpenses(state: ExpensesStateModel) {
    return Object.values(state.expenses).filter((e) => !e.categoryId);
  }

  @Action(ExpensesActions.Add)
  addExpense(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Add) {
    const state = ctx.getState();

    const categoryExists = action.categoryId && action.categoryId in state.categories;
    if (!categoryExists) {
      throw new Error(
        `Couldn't create expense, because category id ${action.categoryId} doesn't exist.`,
      );
    }

    ctx.patchState({
      expenses: {
        ...state.expenses,
        [action.id]: {
          id: action.id,
          price: action.price,
          categoryId: action.categoryId,
          datetime: action.datetime,
        },
      },
    });
  }

  @Action(ExpensesActions.Edit)
  editExpense(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Edit) {
    const state = ctx.getState();

    if (!(action.expense.id in state.expenses)) {
      throw new Error(`Couldn't edit expense, because id ${action.expense.id} doesn't exist.`);
    }

    if (action.expense.categoryId && !(action.expense.categoryId in state.categories)) {
      throw new Error(
        `Couldn't edit expense, because category ${action.expense.categoryId} doesn't exist`,
      );
    }

    ctx.patchState({
      expenses: {
        ...state.expenses,
        [action.expense.id]: action.expense,
      },
    });
  }

  @Action(ExpensesActions.Delete)
  deleteExpense(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.Delete) {
    const state = ctx.getState();

    const { [action.id]: removed, ...newExpenses } = state.expenses;

    ctx.patchState({
      expenses: newExpenses,
    });
  }

  @Action(CategoryActions.Delete)
  deleteCategory(ctx: StateContext<ExpensesStateModel>, action: CategoryActions.Delete) {
    const state = ctx.getState();

    if (!(action.id in state.categories)) throw new Error(`Category ${action.id} doesn't exist.`);

    const { [action.id]: removed, ...newCategories } = state.categories;

    const newExpenses: Record<string, Expense> = action.deleteAllAssociatedExpenses
      ? Object.fromEntries(
          Object.entries(state.expenses).filter(([_, e]) => e.categoryId !== action.id),
        )
      : Object.fromEntries(
          Object.entries(state.expenses).map(([_, e]) => [
            e.id,
            e.categoryId === action.id ? { ...e, categoryId: undefined } : e,
          ]),
        );

    ctx.patchState({
      categories: newCategories,
      expenses: newExpenses,
    });
  }

  @Action(CategoryActions.Add)
  addCategory(ctx: StateContext<ExpensesStateModel>, action: CategoryActions.Add) {
    const state = ctx.getState();

    const nameIsDuplicate = Object.values(state.categories).some((c) => c.name === action.name);
    if (nameIsDuplicate) throw new Error(`A category with the name ${action.name} already exists.`);

    const newCategores = {
      ...state.categories,
      [action.id]: {
        id: action.id,
        name: action.name,
      } as Category,
    };

    let newExpenses = state.expenses;
    if (action.assignCategorylessExpensesToThis) {
      newExpenses = Object.fromEntries(
        Object.entries(state.expenses).map(([_, e]) => [
          e.id,
          e.categoryId ? e : { ...e, categoryId: action.id },
        ]),
      );
    }

    ctx.patchState({
      categories: newCategores,
      expenses: newExpenses,
    });
  }

  @Action(CategoryActions.Edit)
  editCategory(ctx: StateContext<ExpensesStateModel>, action: CategoryActions.Edit) {
    const state = ctx.getState();

    if (!(action.category.id in state.categories)) {
      throw new Error(`Couldn't edit category, because id ${action.category.id} doesn't exist.`);
    }

    const nameIsDuplicate = Object.values(state.categories).some(
      (c) => c.name === action.category.name,
    );
    if (nameIsDuplicate)
      throw new Error(
        `Couldn't edit category, because another category with the name ${action.category.name} already exists.`,
      );

    ctx.patchState({
      categories: {
        ...state.categories,
        [action.category.id]: action.category,
      },
    });
  }
}

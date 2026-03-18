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
        datetime: new Date().toISOString(),
        price: 2.75,
      },
      'default-2': {
        id: 'default-2',
        categoryId: 'default-transport',
        datetime: new Date().toISOString(),
        price: 2.75,
      },
      'default-3': {
        id: 'default-3',
        categoryId: 'default-food',
        datetime: new Date().toISOString(),
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
    categoriesOrder: ['default-transport', 'default-health', 'default-food'],
  },
})
@Injectable()
export class ExpensesState {
  @Selector()
  static getExpensesWithCategory(state: ExpensesStateModel) {
    return Object.values(state.expenses).map(
      (expense) =>
        ({
          ...expense,
          category: expense.categoryId ? state.categories[expense.categoryId] : null,
        }) as ExpenseWithCategory,
    );
  }

  static getExpensesWithCategoryById(id: string) {
    return createSelector([ExpensesState], (state: ExpensesStateModel) => {
      if (!(id in state.expenses)) {
        return undefined;
      }

      const expense = state.expenses[id];
      return {
        ...expense,
        category: expense.categoryId ? state.categories[expense.categoryId] : null,
      } as ExpenseWithCategory;
    });
  }

  @Selector()
  static getCategories(state: ExpensesStateModel) {
    return state.categoriesOrder.map((id) => state.categories[id]);
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

    // Remove category
    if (!(action.id in state.categories)) throw new Error(`Category ${action.id} doesn't exist.`);

    const { [action.id]: removed, ...newCategories } = state.categories;

    // Remove in categoriesOrder
    const orderIndex = state.categoriesOrder.indexOf(action.id);
    if (orderIndex < 0) {
      throw new Error(
        `Inconsistent state: Category ${action.id} exists, but is not listed in order data`,
      );
    }
    const newCategoriesOrder = [
      ...state.categoriesOrder.slice(0, orderIndex),
      ...state.categoriesOrder.slice(orderIndex + 1),
    ];

    // Update expenses
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

    // Save
    ctx.patchState({
      categories: newCategories,
      expenses: newExpenses,
      categoriesOrder: newCategoriesOrder,
    });
  }

  @Action(CategoryActions.Add)
  addCategory(ctx: StateContext<ExpensesStateModel>, action: CategoryActions.Add) {
    const state = ctx.getState();

    const nameIsDuplicate = Object.values(state.categories).some((c) => c.name === action.name);
    if (nameIsDuplicate) throw new Error(`A category with the name ${action.name} already exists.`);

    const newCategories = {
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
      categories: newCategories,
      expenses: newExpenses,
      categoriesOrder: [...state.categoriesOrder, action.id],
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

  @Action(CategoryActions.Reorder)
  reorderCategories(ctx: StateContext<ExpensesStateModel>, action: CategoryActions.Reorder) {
    const state = ctx.getState();

    // Verify that both sets of ids (new order and existing category objects) are identical
    const idsAreValid =
      action.ids.length === Object.keys(state.categories).length &&
      action.ids.every((id) => id in state.categories);

    if (!idsAreValid) {
      throw new Error(
        `Passed order of category ids doesn't match the existing category ids in the state. Some ids are either missing or don't exist`,
      );
    }

    ctx.patchState({
      categoriesOrder: action.ids,
    });
  }

  @Action(ExpensesActions.DeleteAllData)
  deleteAllData(ctx: StateContext<ExpensesStateModel>, action: ExpensesActions.DeleteAllData) {
    ctx.setState({ expenses: {}, categories: {}, categoriesOrder: [] });
  }
}

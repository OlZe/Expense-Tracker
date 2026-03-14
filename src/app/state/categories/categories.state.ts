import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { CategoriesStateModel } from './categories.model';
import { Injectable } from '@angular/core';
import { CategoryActions } from './categories.action';

@State<CategoriesStateModel>({
  name: 'categories',
  defaults: {
    categories: [
      {
        id: 'transport',
        name: '🚗 Transport',
      },
      {
        id: 'health',
        name: '❤️‍🩹 Health',
      },
      {
        id: 'food',
        name: '🍽️ Food & Drinks',
      },
    ],
  },
})
@Injectable()
export class CategoriesState {
  @Selector()
  static getCategories(state: CategoriesStateModel) {
    return state.categories;
  }

  static getCategoryById(id: string) {
    return createSelector([CategoriesState], (state: CategoriesStateModel) => {
      return state.categories.find((c) => c.id === id);
    });
  }

  @Action(CategoryActions.Add)
  addCategory(ctx: StateContext<CategoriesStateModel>, action: CategoryActions.Add) {
    const state = ctx.getState();

    const nameIsDuplicate = state.categories.some((c) => c.name === action.name);
    if (nameIsDuplicate) throw new Error(`A category with the name ${action.name} already exists.`);

    ctx.patchState({
      categories: [
        ...state.categories,
        {
          id: crypto.randomUUID(),
          name: action.name,
        },
      ],
    });
  }

  @Action(CategoryActions.Edit)
  editCategory(ctx: StateContext<CategoriesStateModel>, action: CategoryActions.Edit) {
    const state = ctx.getState();

    const index = state.categories.findIndex((c) => c.id === action.category.id);
    if (index < 0) throw new Error(`Category ${action.category.id} doesn't exist.`);

    ctx.patchState({
      categories: [
        ...state.categories.slice(0, index),
        {
          ...state.categories[index],
          ...action.category,
        },
        ...state.categories.slice(index + 1),
      ],
    });
  }

  @Action(CategoryActions.Delete)
  deleteCategory(ctx: StateContext<CategoriesStateModel>, action: CategoryActions.Delete) {
    const state = ctx.getState();

    const index = state.categories.findIndex((c) => c.id === action.id);
    if (index < 0) throw new Error(`Category ${action.id} doesn't exist.`);

    ctx.patchState({
      categories: [...state.categories.slice(0, index), ...state.categories.slice(index + 1)],
    });
  }
}

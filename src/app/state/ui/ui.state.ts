import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UiStateModel } from './ui.model';
import { UiActions } from './ui.action';

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    selectedPiechartTimerange: 'max',
  },
})
@Injectable()
export class UiState {
  @Selector()
  static getSelectedPiechartTimerange(state: UiStateModel) {
    return state.selectedPiechartTimerange;
  }

  @Action(UiActions.SelectPiechartTimerange)
  selectPiechartTimerange(
    ctx: StateContext<UiStateModel>,
    action: UiActions.SelectPiechartTimerange,
  ) {
    ctx.patchState({
      selectedPiechartTimerange: action.piechartTimerange,
    });
  }
}

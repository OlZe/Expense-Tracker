export type PiechartTimerange = 'one-day' | 'one-week' | 'one-month' | 'one-year' | 'max';

export interface UiStateModel {
  selectedPiechartTimerange: PiechartTimerange;
}

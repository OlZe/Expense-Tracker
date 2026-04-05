import { PiechartTimerange } from './ui.model';

const ACTION_SCOPE = '[Ui]';

export namespace UiActions {
  export class SelectPiechartTimerange {
    static readonly type = `${ACTION_SCOPE} Select Piechart Timerange`;
    constructor(public piechartTimerange: PiechartTimerange) {}
  }
}

import { Expense } from "./expenses.model";

const ACTION_SCOPE = '[Expenses]';

export namespace ExpensesActions {

  export class Add {
    static readonly type = `${ACTION_SCOPE} Add`;
    constructor(public datetime: Date, public price: number, public categoryId?: string) { }
  }

  export class Edit {
    static readonly type = `${ACTION_SCOPE} Edit`;
    constructor(public expense: Expense) { }
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Edit`;
    constructor(public id: string) { };
  }

}

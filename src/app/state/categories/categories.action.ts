import { Category } from './categories.model';

const ACTION_SCOPE = '[Category]';

export namespace CategoryActions {
  export class Add {
    static readonly type = `${ACTION_SCOPE} Add`;
    constructor(public name: string) {}
  }

  export class Edit {
    static readonly type = `${ACTION_SCOPE} Edit`;
    constructor(public category: Category) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete`;
    constructor(
      public id: string,
      public deleteAllAssociatedExpenses: boolean,
    ) {}
  }
}

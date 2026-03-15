import { Category } from './categories.model';

const ACTION_SCOPE = '[Category]';

export namespace CategoryActions {
  export class Add {
    static readonly type = `${ACTION_SCOPE} Add`;
    public id = crypto.randomUUID();

    constructor(
      public name: string,
      public assignCategorylessExpensesToThis: boolean,
    ) {}
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

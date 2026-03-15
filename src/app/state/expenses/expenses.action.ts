import { Category, Expense } from './expenses.model';

const ACTION_SCOPE = '[Expenses]';

export namespace ExpensesActions {
  export class Add {
    static readonly type = `${ACTION_SCOPE} Add expense`;
    public id = crypto.randomUUID();
    constructor(
      public datetime: string,
      public price: number,
      public categoryId?: string,
    ) {}
  }

  export class Edit {
    static readonly type = `${ACTION_SCOPE} Edit expense`;
    constructor(public expense: Expense) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete expense`;
    constructor(public id: string) {}
  }
}

export namespace CategoryActions {
  export class Add {
    static readonly type = `${ACTION_SCOPE} Add Category`;
    public id = crypto.randomUUID();

    constructor(
      public name: string,
      public assignCategorylessExpensesToThis: boolean,
    ) {}
  }

  export class Edit {
    static readonly type = `${ACTION_SCOPE} Edit Category`;
    constructor(public category: Category) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete Category`;
    constructor(
      public id: string,
      public deleteAllAssociatedExpenses: boolean,
    ) {}
  }
}

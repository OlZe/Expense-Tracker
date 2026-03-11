export interface Expense {
  id: string;
  categoryId?: string;
  datetime: Date;
  price: number;
}

export interface ExpensesStateModel {
  expenses: Expense[];
}

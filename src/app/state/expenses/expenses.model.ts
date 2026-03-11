import { Category } from "../categories/categories.model";

export interface Expense {
  id: string;
  categoryId?: string;
  datetime: Date;
  price: number;
}

export type ExpenseWithCategory = Expense & { category?: Category }

export interface ExpensesStateModel {
  expenses: Expense[];
}

export interface Expense {
  id: string;
  categoryId?: string;
  datetime: Date;
  price: number;
}

export interface Category {
  id: string;
  name: string;
}

export type ExpenseWithCategory = Expense & { category: Category | null };

export interface ExpensesStateModel {
  expenses: Record<string, Expense>;
  categories: Record<string, Category>;
}

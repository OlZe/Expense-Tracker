import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../../../state/expenses/expenses.model';
import { ExpensesState } from '../../../state/expenses/expenses.state';
import { CategoryActions } from '../../../state/expenses/expenses.action';
import { MatCheckboxModule } from '@angular/material/checkbox';

type DeleteView =
  | {
      kind: 'with expenses';
      selectedMethod?: 'deleteExpenses' | 'dontDeleteExpenses';
    }
  | {
      kind: 'without expenses';
      confirmed: boolean;
    };

@Component({
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './edit-category-page.html',
  styleUrl: './edit-category-page.scss',
  standalone: true,
})
export class EditCategoryDialog {
  readonly category!: Category;
  newName!: string;
  deleteView!: DeleteView;

  constructor(
    private store: Store,
    private router: Router,
    private snackbarService: SnackbarService,
    private destroyRef: DestroyRef,
    route: ActivatedRoute,
  ) {
    const id = route.snapshot.paramMap.get('id');
    if (!id) {
      router.navigateByUrl('/');
      return;
    }
    const category = store.selectSnapshot(ExpensesState.getCategoryById(id));
    if (!category) {
      router.navigateByUrl('/');
      return;
    }
    this.category = category;
    this.newName = category.name;
    const hasExpenses =
      store.selectSnapshot(ExpensesState.getExpensesWithCategory).filter((e) => e.categoryId === id)
        .length > 0;
    this.deleteView = hasExpenses
      ? { kind: 'with expenses', selectedMethod: undefined }
      : { kind: 'without expenses', confirmed: false };
  }

  isChangeNameButtonDisabled(): boolean {
    return !this.newName || this.newName === this.category.name;
  }

  changeName() {
    if (this.isChangeNameButtonDisabled()) {
      return;
    }

    const oldCategory = this.category;
    const newCategory = {
      ...oldCategory,
      name: this.newName,
    };

    this.store
      .dispatch(new CategoryActions.Edit(newCategory))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbarService.show(`Changed '${oldCategory.name}' to '${newCategory.name}'.`);
          this.router.navigateByUrl('/');
        },
        error: (message) => {
          this.snackbarService.error(message);
        },
      });
  }

  isDeleteDisabled(): boolean {
    if (this.deleteView.kind === 'with expenses') {
      return !this.deleteView.selectedMethod;
    } else {
      return !this.deleteView.confirmed;
    }
  }

  delete() {
    if (this.isDeleteDisabled()) {
      return;
    }

    const deleteAllAssociatedExpenses =
      this.deleteView.kind === 'with expenses'
        ? this.deleteView.selectedMethod === 'deleteExpenses'
        : false;

    this.store
      .dispatch(new CategoryActions.Delete(this.category.id, deleteAllAssociatedExpenses))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const message = deleteAllAssociatedExpenses
            ? `Deleted ${this.category.name} and all its expenses.`
            : `Deleted ${this.category.name}`;
          this.snackbarService.show(message);
          this.router.navigateByUrl('/');
        },
        error: (message) => {
          this.snackbarService.error(message);
        },
      });
  }
}

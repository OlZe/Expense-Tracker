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

@Component({
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
  ],
  templateUrl: './edit-category-page.html',
  styleUrl: './edit-category-page.scss',
  standalone: true,
})
export class EditCategoryDialog {
  readonly category!: Category;
  newName!: string;
  selectedDeleteMethod?: 'deleteExpenses' | 'dontDeleteExpenses';

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
      });
  }

  isDeleteDisabled(): boolean {
    return !this.selectedDeleteMethod;
  }

  delete() {
    if (this.isDeleteDisabled()) {
      return;
    }

    this.store
      .dispatch(
        new CategoryActions.Delete(
          this.category.id,
          this.selectedDeleteMethod === 'deleteExpenses',
        ),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const message =
            this.selectedDeleteMethod === 'deleteExpenses'
              ? `Deleted ${this.category.name} and all its expenses.`
              : `Deleted ${this.category.name}`;
          this.snackbarService.show(message);
          this.router.navigateByUrl('/');
        },
      });
  }
}

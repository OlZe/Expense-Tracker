import { Component, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SnackbarService } from '../../services/snackbar.service';
import { CategoryActions, ExpensesActions } from '../../state/expenses/expenses.action';
import { take } from 'rxjs';
import { Category } from '../../state/expenses/expenses.model';
import { ExpensesState } from '../../state/expenses/expenses.state';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    CdkDrag,
    CdkDropList,
    MatIcon,
    CdkDragHandle,
    CdkDragPlaceholder,
    CdkDragPreview,
  ],
  templateUrl: './settings-page.html',
})
export class SettingsPage {
  confirmDeleteAllData1 = false;
  confirmDeleteAllData2 = false;
  hasReorderedCategories = false;
  categories!: Category[];

  constructor(
    private store: Store,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {
    this.loadCategoryOrder();
  }

  loadCategoryOrder() {
    this.categories = this.store.selectSnapshot(ExpensesState.getCategories).slice();
    this.hasReorderedCategories = false;
  }

  saveCategoryOrder() {
    if (!this.hasReorderedCategories) {
      return;
    }

    this.store
      .dispatch(new CategoryActions.Reorder(this.categories.map((c) => c.id)))
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadCategoryOrder();
          this.snackbarService.show('Categories sucessfully reordered.');
        },
        error: (message) => {
          this.snackbarService.error(message);
        },
      });
  }

  isDeleteAllDataDisabled(): boolean {
    return !this.confirmDeleteAllData1 || !this.confirmDeleteAllData2;
  }

  deleteAllData() {
    if (this.isDeleteAllDataDisabled()) {
      return;
    }

    this.store
      .dispatch(new ExpensesActions.DeleteAllData())
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackbarService.show('All data deleted.');
          this.router.navigateByUrl('/');
        },
        error: (message) => {
          this.snackbarService.error(message);
        },
      });
  }

  onDragDropCategory(event: CdkDragDrop<any>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    this.hasReorderedCategories = true;
  }
}

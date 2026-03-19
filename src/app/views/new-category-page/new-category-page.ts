import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngxs/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ExpensesState } from '../../state/expenses/expenses.state';
import { JsonPipe, Location } from '@angular/common';
import { CategoryActions } from '../../state/expenses/expenses.action';
import { NavigateBackButton } from '../../components/navigate-back-button/navigate-back-button';

@Component({
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    NavigateBackButton,
  ],
  templateUrl: './new-category-page.html',
})
export class NewCategoryPage implements AfterViewInit {
  newName: string = '';
  assignCategorylessExpenses = false;
  inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private store = inject(Store);
  categorylessExpenses = this.store.selectSignal(ExpensesState.getCategorylessExpenses);
  showAssignCategorylessExpensesCheckbox = computed(
    () => this.categorylessExpenses() && this.categorylessExpenses().length > 0,
  );

  constructor(
    private destroyRef: DestroyRef,
    private snackbarService: SnackbarService,
    private location: Location,
  ) {}

  ngAfterViewInit(): void {
    this.inputElement().nativeElement.focus();
  }

  isCreateButtonDisabled(): boolean {
    return !this.newName;
  }

  createCategory() {
    if (this.isCreateButtonDisabled()) {
      return;
    }
    this.store
      .dispatch(new CategoryActions.Add(this.newName, this.assignCategorylessExpenses))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbarService.show(`Created '${this.newName}'`);
          this.location.back();
        },
        error: (message) => {
          this.snackbarService.error(message);
        },
      });
  }
}

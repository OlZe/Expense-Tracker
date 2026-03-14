import { Component, computed, inject, input, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CategoriesState } from '../../state/categories/categories.state';
import { Category } from '../../state/categories/categories.model';
import { MoneyInput } from '../../components/money-input/money-input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  templateUrl: './category-page.html',
  imports: [MoneyInput, MatButtonModule],
})
export class CategoryPage {
  category!: Category;
  moneyInput = signal(0);
  createExpenseButtonDisabled = computed(() => this.moneyInput() <= 0);


  constructor(route: ActivatedRoute, store: Store, router: Router) {
    const id = route.snapshot.paramMap.get('id');
    if (!id) {
      router.navigateByUrl('/');
      return;
    }
    const category = store.selectSnapshot(CategoriesState.getCategoryById(id));
    if (!category) {
      router.navigateByUrl('/');
      return;
    }
    this.category = category;
  }

  onMoneyInput(inputNum: number) {
    this.moneyInput.set(inputNum);
  }

  onSaveExpenseButton() {
    alert('todo');
  }
}

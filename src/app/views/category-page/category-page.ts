import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CategoriesState } from '../../state/categories/categories.state';
import { Category } from '../../state/categories/categories.model';
import { MoneyInput } from "../../components/money-input/money-input";

@Component({
  standalone: true,
  templateUrl: './category-page.html',
  imports: [MoneyInput],
})
export class CategoryPage {
  category!: Category;

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
}

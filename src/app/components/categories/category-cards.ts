import { Component, Signal } from "@angular/core";
import { Store } from "@ngxs/store";
import { CategoriesState } from "../../state/categories/categories.state";
import { Category } from "../../state/categories/categories.model";
import { CategoryCard } from "./category-card/category-card";
import { CategoryCardCreateNew } from "./category-card-create-new/category-card-create-new";

@Component({
  standalone: true,
  templateUrl: './category-cards.html',
  imports: [CategoryCard, CategoryCardCreateNew],
  selector: 'category-cards'
})
export class CategoryCards {
  categories: Signal<Category[]>;

  constructor(store: Store) {
    this.categories = store.selectSignal(CategoriesState.getCategories)
  }
}
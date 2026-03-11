import { Component, input, InputSignal, Signal } from "@angular/core";
import { Category } from "../../../state/categories/categories.model";

@Component({
  selector: 'category-card',
  standalone: true,
  templateUrl: './category-card.html',
  imports: []
})
export class CategoryCard {

  category: InputSignal<Category> = input.required<Category>();
}
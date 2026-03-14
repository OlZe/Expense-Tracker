import { Component, input, InputSignal, Signal } from '@angular/core';
import { Category } from '../../../state/categories/categories.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'category-card',
  standalone: true,
  templateUrl: './category-card.html',
  imports: [RouterLink],
})
export class CategoryCard {
  category: InputSignal<Category> = input.required<Category>();
}

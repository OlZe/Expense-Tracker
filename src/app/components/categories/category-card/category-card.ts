import { Component, input, InputSignal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../state/expenses/expenses.model';

@Component({
  selector: 'category-card',
  standalone: true,
  templateUrl: './category-card.html',
  imports: [RouterLink],
})
export class CategoryCard {
  category: InputSignal<Category> = input.required<Category>();
}

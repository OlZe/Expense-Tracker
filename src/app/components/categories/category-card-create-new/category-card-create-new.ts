import { Component, input, InputSignal, Signal } from "@angular/core";
import { Category } from "../../../state/categories/categories.model";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'category-card-create-new',
  standalone: true,
  templateUrl: './category-card-create-new.html',
  imports: [RouterLink]
})
export class CategoryCardCreateNew {
}
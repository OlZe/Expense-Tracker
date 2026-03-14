import { Component } from '@angular/core';
import { Graph } from "../../components/graph/graph";
import { CategoryCards } from "../../components/categories/category-cards";
import { Expenses } from "../../components/expenses/expenses";

@Component({
  standalone: true,
  templateUrl: './home-page.html',
  imports: [Graph, CategoryCards, Expenses],
})
export class HomePage {}

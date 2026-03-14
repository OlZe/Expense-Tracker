import { Component, Signal, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { ExpensesState } from './state/expenses/expenses.state';
import { ExpenseWithCategory } from './state/expenses/expenses.model';
import { JsonPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Graph } from './components/graph/graph';
import { CategoryCards } from './components/categories/category-cards';
import { Expenses } from './components/expenses/expenses';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, RouterOutlet],
  templateUrl: './app.html',
})
export class App {}

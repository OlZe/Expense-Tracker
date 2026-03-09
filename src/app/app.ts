import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [MatSlideToggleModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('expense-tracker');
}

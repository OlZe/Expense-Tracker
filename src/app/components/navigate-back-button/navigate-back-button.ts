import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  selector: 'navigate-back-button',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './navigate-back-button.html',
})
export class NavigateBackButton {
  location = inject(Location);

  navigateBack() {
    this.location.back();
  }
}

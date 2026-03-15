import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  show(message: string) {
    this.snackbar.open(message, 'OK', { duration: 3000 });
  }

  // TODO: Styling
  error(message: string) {
    this.snackbar.open(message, 'OK', { duration: 3000, panelClass: 'snackbar-error' });
  }
}

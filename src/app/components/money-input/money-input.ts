import { Component, input, Input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'money-input',
  templateUrl: './money-input.html',
  imports: [FormsModule],
  standalone: true,
})
export class MoneyInput {
  inputValue: string = '';
  formattedValue: string = '0,00 €';

  private formatter = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  onInput() {
    console.log('before', this.inputValue);

    // Replace , with .
    const cleaned1 = this.inputValue.replaceAll(',', '.');

    // Remove all characters which arent . or digits
    const cleaned2 = cleaned1.replace(/[^\d.]/g, '');

    // Handle multiple periods
    let cleaned3 = cleaned2;
    const multiplePeriods = (cleaned2.match(/\./g)?.length ?? 0) > 1;
    if (multiplePeriods) {
      // If there are multiple periods, then there must've been a 2nd period inserted in last position
      cleaned3 = cleaned2.slice(0, -1);
    }

    // If entering a 3rd digit after decimal, replace
    // ie: 0.17 (old) => 0.179 (enter) => 0.19 (new)
    let cleaned4 = cleaned3;
    const thirdDigitMatch = cleaned3.match(/\.\d\d\d/);
    if (thirdDigitMatch && thirdDigitMatch.length > 0) {
      cleaned4 = cleaned3.slice(0, -2) + cleaned3.charAt(cleaned3.length - 1);
    }

    this.inputValue = cleaned4;
    console.log('after clean', this.inputValue);

    let inputNumber = Number.parseFloat(this.inputValue);
    if (inputNumber < 0 || Number.isNaN(inputNumber)) {
      inputNumber = 0;
    }

    this.formattedValue = `${this.formatter.format(inputNumber)} €`;
    console.log('formatted', this.formattedValue);
  }
}

import { Component, input, Input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

type DigitDisplayElement = {
  text: string;
  format: 'entered' | 'placeholder';
};

@Component({
  selector: 'money-input',
  templateUrl: './money-input.html',
  imports: [FormsModule],
  standalone: true,
})
export class MoneyInput {
  inputValue: string = '';
  formattedValue = {
    euros: { text: '0', format: 'placeholder' } as DigitDisplayElement,
    cents: [{ kind: 'string', text: '00', format: 'placeholder' } as DigitDisplayElement],
  };
  isDecimalPointTyped = false;

  inputNumber = output<number>();

  private formatter = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  onInput() {
    let inputNum = 0;

    let cleanedInput = this.inputValue.replaceAll(',', '.');
    cleanedInput = cleanedInput.replace(/[^\d.]/g, '');

    const decimalIndex = cleanedInput.indexOf('.');
    this.isDecimalPointTyped = decimalIndex >= 0;

    const euroInput = cleanedInput.slice(0, this.isDecimalPointTyped ? decimalIndex : undefined);

    if (!euroInput) {
      this.formattedValue.euros = { text: '0', format: 'placeholder' };
      inputNum = 0;
    } else {
      const euroInputNumber = Number.parseInt(euroInput); // Only got chars until first . so digits are good
      inputNum = euroInputNumber;
      this.formattedValue.euros = {
        text: this.formatter.format(euroInputNumber),
        format: 'entered',
      };
    }

    let centInput = this.isDecimalPointTyped ? cleanedInput.slice(decimalIndex + 1) : undefined;
    centInput = centInput?.replaceAll('.', ''); // Ignore duplicate decimals so only digits remain
    if (!centInput || centInput.length == 0) {
      this.formattedValue.cents = [{ text: '00', format: 'placeholder' }];
    } else if (centInput.length == 1) {
      this.formattedValue.cents = [
        { text: centInput, format: 'entered' },
        { text: '0', format: 'placeholder' },
      ];
      inputNum += Number.parseInt(centInput) / 10;
    } else if (centInput.length > 1) {
      centInput = centInput.slice(0, 2);
      this.formattedValue.cents = [{ text: centInput, format: 'entered' }];
      inputNum += Number.parseInt(centInput) / 100;
    }

    this.inputNumber.emit(inputNum);
  }
}

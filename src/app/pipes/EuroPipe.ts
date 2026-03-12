import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'euro',
  standalone: true,
})
export class EuroPipe implements PipeTransform {
  private formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  transform(value: number): string {
    return this.formatter.format(value);
  }

}
import { Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { ExpenseWithCategory } from '../../state/expenses/expenses.model';
import { ApexDataLabels, NgApexchartsModule } from 'ng-apexcharts';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { PiechartTimerange } from '../../state/ui/ui.model';
import { Store } from '@ngxs/store';
import { UiState } from '../../state/ui/ui.state';
import { UiActions } from '../../state/ui/ui.action';

@Component({
  standalone: true,
  imports: [NgApexchartsModule, MatChipsModule],
  templateUrl: './graph.html',
  selector: 'graph',
})
export class Graph {
  private store = inject(Store);
  selectedTimerangeButton = this.store.selectSignal(UiState.getSelectedPiechartTimerange);
  timerangeButtons: { value: PiechartTimerange; label: string }[] = [
    { value: 'one-day', label: '1D' },
    { value: 'one-week', label: '1W' },
    { value: 'one-month', label: '1M' },
    { value: 'one-year', label: '1Y' },
    { value: 'max', label: 'MAX' },
  ];
  allExpenses = input.required<ExpenseWithCategory[]>();
  graphData = computed(() => this.prepareGraphData(this.allExpenses()));
  chartOptions = computed(() => {
    return {
      series: this.graphData().map(([category, sum]) => sum),
      labels: this.graphData().map(([category, sum]) => category),
      dataLabels: {
        formatter: (value, { seriesIndex, dataPointIndex, w }) => {
          const [category, sum] = this.graphData()[seriesIndex];
          return sum.toFixed(2) + ' €';
        },
      } as ApexDataLabels,
    };
  });

  prepareGraphData(expenses: ExpenseWithCategory[]): [string, number][] {
    const now = new Date();

    const minDate = (() => {
      const d = new Date(now);

      switch (this.selectedTimerangeButton()) {
        case 'one-day':
          d.setDate(d.getDate() - 1);
          break;
        case 'one-week':
          d.setDate(d.getDate() - 7);
          break;
        case 'one-month':
          d.setMonth(d.getMonth() - 1);
          break;
        case 'one-year':
          d.setFullYear(d.getFullYear() - 1); // ✅ FIXED
          break;
        default:
          return new Date(0);
      }

      return d;
    })();

    const record: Record<string, number> = {};

    for (const e of expenses) {
      if (new Date(e.datetime) < minDate) continue;

      const key = e.category?.name ?? 'no category';
      record[key] = (record[key] ?? 0) + e.price;
    }

    return Object.entries(record).sort((a, b) => b[1] - a[1]);
  }

  onTimerangeChange(value: PiechartTimerange) {
    this.store.dispatch(new UiActions.SelectPiechartTimerange(value));
  }
}

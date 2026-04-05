import { Component, computed, ElementRef, input, viewChild } from '@angular/core';
import { Category, ExpenseWithCategory } from '../../state/expenses/expenses.model';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './graph.html',
  selector: 'graph',
})
export class Graph {
  summedCategories = input.required<[string, number][], ExpenseWithCategory[]>({
    alias: 'expenses',
    transform: this.expensesToSummedCategores,
  });
  chartOptions = computed(() => {
    return {
      series: this.summedCategories().map(([category, sum]) => sum),
      labels: this.summedCategories().map(([category, sum]) => category),
      dataLabels: {
        formatter: (value, { seriesIndex, dataPointIndex, w }) => {
          const [category, sum] = this.summedCategories()[seriesIndex];
          return sum.toFixed(2) + ' €';
        },
      } as ApexDataLabels,
    };
  });

  expensesToSummedCategores(expenses: ExpenseWithCategory[]): [string, number][] {
    const record = expenses.reduce((acc, e): Record<string, number> => {
      const key = e.category?.name ?? 'no category';
      return {
        ...acc,
        [key]: (acc[key] ?? 0) + e.price,
      };
    }, {});

    return Object.entries(record)
      .slice()
      .sort(([, sum1], [, sum2]) => sum2 - sum1);
  }
}

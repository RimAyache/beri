import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string>();
  trend = input.required<number>();
  sparkline = input<number[]>([]);

  isPositive = computed(() => this.trend() >= 0);

  sparklinePoints = computed(() => {
    const values = this.sparkline();
    if (values.length < 2) return '';

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const step = 100 / (values.length - 1);

    return values
      .map((value, index) => `${index * step},${30 - ((value - min) / range) * 30}`)
      .join(' ');
  });
}

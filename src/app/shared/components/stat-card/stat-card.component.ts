import { Component, computed, input } from '@angular/core';

import { config } from '../../config';

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

  readonly sparklineViewBox = `0 0 ${config.statCard.sparklineWidth} ${config.statCard.sparklineHeight}`;

  sparklinePoints = computed(() => {
    const values = this.sparkline();
    if (values.length < 2) return '';

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const { sparklineWidth, sparklineHeight } = config.statCard;
    const step = sparklineWidth / (values.length - 1);

    return values
      .map(
        (value, index) =>
          `${index * step},${sparklineHeight - ((value - min) / range) * sparklineHeight}`,
      )
      .join(' ');
  });
}

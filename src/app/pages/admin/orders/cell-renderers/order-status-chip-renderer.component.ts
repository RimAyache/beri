import { Component } from '@angular/core';
import type { ICellRendererAngularComp as ICellRenderer } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

import { OrderChipVariant } from '../../../../models/admin.model';

@Component({
  selector: 'app-order-status-chip-renderer',
  templateUrl: './order-status-chip-renderer.component.html',
  styleUrl: './order-status-chip-renderer.component.css',
})
export class OrderStatusChipRenderer implements ICellRenderer {
  label = '';
  variant: OrderChipVariant = 'neutral';

  agInit(params: ICellRendererParams): void {
    this.setState(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.setState(params);
    return true;
  }

  private setState(params: ICellRendererParams): void {
    this.label = params.value ?? '';
    this.variant =
      params.value === 'Completed'
        ? 'completed'
        : params.value === 'Pending'
          ? 'pending'
          : params.value === 'Cancelled'
            ? 'cancelled'
            : 'neutral';
  }
}

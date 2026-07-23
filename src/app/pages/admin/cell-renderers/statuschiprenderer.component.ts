import { Component } from '@angular/core';
import type { ICellRendererAngularComp as ICellRenderer } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

type ChipVariant = 'available' | 'out-of-stock' | 'neutral';

@Component({
  selector: 'app-statuschiprenderer',
  templateUrl: './statuschiprenderer.component.html',
  styleUrl: './statuschiprenderer.component.css',
})
export class StatusChipRenderer implements ICellRenderer {
  label = '';
  variant: ChipVariant = 'neutral';

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
      params.value === 'Available'
        ? 'available'
        : params.value === 'Out of Stock'
          ? 'out-of-stock'
          : 'neutral';
  }
}

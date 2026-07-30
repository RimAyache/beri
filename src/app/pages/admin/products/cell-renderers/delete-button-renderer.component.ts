import { Component } from '@angular/core';
import type { ICellRendererAngularComp as ICellRenderer } from 'ag-grid-angular';

import { DeleteButtonParams } from '../../../../models/admin.model';

@Component({
  selector: 'app-delete-button-renderer',
  templateUrl: './delete-button-renderer.component.html',
  styleUrl: './delete-button-renderer.component.css',
})
export class DeleteButtonRenderer implements ICellRenderer {
  private params!: DeleteButtonParams;

  agInit(params: DeleteButtonParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return true;
  }

  delete(): void {
    this.params.onDelete(this.params.data.Id);
  }
}

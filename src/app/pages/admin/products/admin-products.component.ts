import { Component, OnInit, inject, signal } from '@angular/core';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridAngular } from 'ag-grid-angular';
import type { CellValueChangedEvent, ColDef, ValueFormatterParams } from 'ag-grid-community';
import { StatusChipRenderer } from './cell-renderers/status-chip-renderer.component';
import { DeleteButtonRenderer } from './cell-renderers/delete-button-renderer.component';
import { config } from '../../../shared/config';
import { ProductService } from '../../../shared/services/product.service';
import { ProductRow } from '../../../shared/interfaces/admin.interface';
import { Product } from '../../../shared/interfaces/product.interface';

const currencyFormatter = new Intl.NumberFormat(config.locale.id, {
  style: 'currency',
  currency: config.locale.currency,
});

@Component({
  selector: 'app-admin-products',
  imports: [AgGridAngular],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);

  theme = themeQuartz.withParams({
    ...config.gridTheme,
    borderRadius: config.admin.grid.borderRadius,
    wrapperBorderRadius: config.admin.grid.borderRadius,
  });

  defaultColDef: ColDef<ProductRow> = {
    sortable: true,
    filter: true,
  };

  colDefs: ColDef<ProductRow>[] = [
    { field: 'Id', maxWidth: config.admin.grid.idColumnMaxWidth },
    { field: 'Name', flex: config.admin.grid.nameColumnFlex },
    { field: 'Description', flex: config.admin.grid.descriptionColumnFlex, editable: true },
    {
      field: 'Price',
      valueFormatter: (params: ValueFormatterParams<ProductRow, number>) =>
        params.value != null ? currencyFormatter.format(params.value) : '',
    },
    { field: 'Status', filter: true, cellRenderer: StatusChipRenderer },
    {
      headerName: '',
      maxWidth: config.admin.grid.actionColumnMaxWidth,
      sortable: false,
      filter: false,
      cellRenderer: DeleteButtonRenderer,
      cellRendererParams: { onDelete: (id: number) => this.deleteRow(id) },
    },
  ];

  pagination = true;
  paginationPageSize = config.admin.gridPageSize;

  rowData = signal<ProductRow[]>([]);

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.rowData.set(products.map(toRow));
    });
  }

  onCellValueChanged(event: CellValueChangedEvent<ProductRow>): void {
    if (event.colDef.field !== 'Description') return;
    this.productService.updateProduct(event.data.Id, { description: event.data.Description }).subscribe();
  }

  private deleteRow(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.rowData.update((rows) => rows.filter((row) => row.Id !== id));
    });
  }
}

function toRow(product: Product): ProductRow {
  return {
    Id: product.id,
    Name: product.title,
    Description: product.description,
    Price: product.price,
    Status: (product.quantity ?? 0) > 0 ? 'Available' : 'Out of Stock',
  };
}

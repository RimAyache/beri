import { Component, OnInit, inject, signal } from '@angular/core';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridAngular } from 'ag-grid-angular';
import type { CellValueChangedEvent, ColDef, ValueFormatterParams } from 'ag-grid-community';
import { StatusChipRenderer } from './cell-renderers/statuschiprenderer.component';
import { DeleteButtonRenderer } from './cell-renderers/delete-button-renderer.component';
import { ProductService } from '../../../services/product';
import { Product } from '../../../models/product.model';

interface ProductRow {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  Status: 'Available' | 'Out of Stock';
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

@Component({
  selector: 'app-admin-products',
  imports: [AgGridAngular],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);

  theme = themeQuartz.withParams({
    accentColor: '#7b1e3b',
    fontFamily: 'Poppins, sans-serif',
    headerFontFamily: 'Volkhov, serif',
    headerBackgroundColor: '#2e1118',
    headerTextColor: '#ffffff',
    borderRadius: 8,
    wrapperBorderRadius: 8,
  });

  defaultColDef: ColDef<ProductRow> = {
    sortable: true,
    filter: true,
  };

  colDefs: ColDef<ProductRow>[] = [
    { field: 'Id', maxWidth: 90 },
    { field: 'Name', flex: 1 },
    { field: 'Description', flex: 2, editable: true },
    {
      field: 'Price',
      valueFormatter: (params: ValueFormatterParams<ProductRow, number>) =>
        params.value != null ? currencyFormatter.format(params.value) : '',
    },
    { field: 'Status', filter: true, cellRenderer: StatusChipRenderer },
    {
      headerName: '',
      maxWidth: 100,
      sortable: false,
      filter: false,
      cellRenderer: DeleteButtonRenderer,
      cellRendererParams: { onDelete: (id: number) => this.deleteRow(id) },
    },
  ];

  pagination = true;
  paginationPageSize = 10;

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

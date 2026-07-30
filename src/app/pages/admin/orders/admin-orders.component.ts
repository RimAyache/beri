import { Component, OnInit, inject, signal } from '@angular/core';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { OrderStatusChipRenderer } from './cell-renderers/order-status-chip-renderer.component';
import { config } from '../../../config';
import { OrderService } from '../../../services/order';
import { Order } from '../../../models/order.model';

interface OrderRow {
  Id: string;
  Customer: string;
  Date: string;
  Total: number;
  Status: 'Pending' | 'Completed' | 'Cancelled';
}

const currencyFormatter = new Intl.NumberFormat(config.locale.id, {
  style: 'currency',
  currency: config.locale.currency,
});

@Component({
  selector: 'app-admin-orders',
  imports: [AgGridAngular],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  theme = themeQuartz.withParams({
    ...config.gridTheme,
    borderRadius: config.admin.grid.borderRadius,
    wrapperBorderRadius: config.admin.grid.borderRadius,
  });

  defaultColDef: ColDef<OrderRow> = {
    sortable: true,
    filter: true,
  };

  colDefs: ColDef<OrderRow>[] = [
    { field: 'Id', headerName: 'Order', maxWidth: config.admin.grid.orderIdColumnMaxWidth },
    { field: 'Customer', flex: config.admin.grid.nameColumnFlex },
    { field: 'Date', maxWidth: config.admin.grid.dateColumnMaxWidth },
    {
      field: 'Total',
      valueFormatter: (params: ValueFormatterParams<OrderRow, number>) =>
        params.value != null ? currencyFormatter.format(params.value) : '',
    },
    { field: 'Status', filter: true, cellRenderer: OrderStatusChipRenderer },
  ];

  pagination = true;
  paginationPageSize = config.admin.gridPageSize;

  rowData = signal<OrderRow[]>([]);

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.rowData.set(orders.map(toRow));
    });
  }
}

function toRow(order: Order): OrderRow {
  return {
    Id: order.id,
    Customer: order.customerName,
    Date: order.date,
    Total: order.total,
    Status: order.status,
  };
}

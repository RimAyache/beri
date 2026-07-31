import type { ICellRendererParams } from 'ag-grid-community';

import { OrderStatus } from './order.interface';

export interface ProductRow {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  Status: ProductStockStatus;
}

export type ProductStockStatus = 'Available' | 'Out of Stock';

export interface OrderRow {
  Id: string;
  Customer: string;
  Date: string;
  Total: number;
  Status: OrderStatus;
}

export type ProductChipVariant = 'available' | 'out-of-stock' | 'neutral';

export type OrderChipVariant = 'completed' | 'pending' | 'cancelled' | 'neutral';

export interface DeleteButtonParams extends ICellRendererParams {
  onDelete: (id: number) => void;
}

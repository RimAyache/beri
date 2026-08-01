export type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
}

export interface CustomerOrder {
  id: string;
  date: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
}

export interface DashboardStat {
  label: string;
  value: string;
  trend: number;
  sparkline: number[];
}

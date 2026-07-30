import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DashboardStat, Order } from '../models/order.model';

const MOCK_STATS: DashboardStat[] = [
  { label: 'Revenue', value: '$7,825', trend: 22, sparkline: [4, 6, 5, 8, 7, 9, 11] },
  { label: 'Orders', value: '312', trend: 12, sparkline: [5, 5, 6, 7, 6, 8, 9] },
  { label: 'Customers', value: '1,204', trend: 8, sparkline: [3, 4, 4, 5, 6, 6, 7] },
  { label: 'Conversion Rate', value: '3.4%', trend: -2, sparkline: [8, 7, 7, 8, 6, 6, 5] },
];

const MOCK_ORDERS: Order[] = [
  { id: '#ORD-1042', customerName: 'Amelia Carter', date: '2026-07-29', total: 189.97, status: 'Completed' },
  { id: '#ORD-1041', customerName: 'Noah Fischer', date: '2026-07-29', total: 55.99, status: 'Pending' },
  { id: '#ORD-1040', customerName: 'Sofia Marin', date: '2026-07-28', total: 219.9, status: 'Completed' },
  { id: '#ORD-1039', customerName: 'Liam Novak', date: '2026-07-28', total: 109.95, status: 'Cancelled' },
  { id: '#ORD-1038', customerName: 'Zoe Bennett', date: '2026-07-27', total: 75.0, status: 'Completed' },
  { id: '#ORD-1037', customerName: 'Ethan Cole', date: '2026-07-27', total: 142.5, status: 'Pending' },
  { id: '#ORD-1036', customerName: 'Mia Torres', date: '2026-07-26', total: 89.99, status: 'Completed' },
];

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  getStats(): Observable<DashboardStat[]> {
    return of(MOCK_STATS);
  }

  getRecentOrders(): Observable<Order[]> {
    return of(MOCK_ORDERS);
  }

  getOrders(): Observable<Order[]> {
    return of(MOCK_ORDERS);
  }
}

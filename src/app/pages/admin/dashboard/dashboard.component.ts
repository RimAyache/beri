import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';

import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { OrderService } from '../../../shared/services/order.service';
import { DashboardStat, Order } from '../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CurrencyPipe, StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  stats = signal<DashboardStat[]>([]);
  orders = signal<Order[]>([]);

  ngOnInit(): void {
    this.orderService.getStats().subscribe((stats) => this.stats.set(stats));
    this.orderService.getRecentOrders().subscribe((orders) => this.orders.set(orders));
  }
}

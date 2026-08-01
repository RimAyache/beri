import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/auth/auth.service';
import { CustomerOrder } from '../../shared/interfaces/order.interface';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-profile',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);

  protected readonly user = this.authService.currentUser;

  protected readonly pendingOrders = toSignal(this.orderService.getMyPendingOrders(), {
    initialValue: [] as CustomerOrder[],
  });

  protected readonly recentOrders = toSignal(this.orderService.getMyRecentOrders(), {
    initialValue: [] as CustomerOrder[],
  });

  protected readonly fullName = computed(() => {
    const name = [this.user?.firstName, this.user?.lastName].filter(Boolean).join(' ');
    return name || this.user?.username || '—';
  });

  protected readonly initials = computed(() => {
    const first = this.user?.firstName?.[0] ?? this.user?.username?.[0] ?? '?';
    const last = this.user?.lastName?.[0] ?? '';
    return `${first}${last}`.toUpperCase();
  });

  protected statusModifier(status: CustomerOrder['status']): string {
    return status.toLowerCase();
  }
}

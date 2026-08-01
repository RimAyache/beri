import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { config } from '../../config';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-mini-cart',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.css',
})
export class MiniCartComponent {
  private readonly cartService = inject(CartService);

  readonly isOpen = this.cartService.isMiniCartOpen;
  readonly items = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;

  readonly amountToFreeShipping = computed(() =>
    Math.max(0, config.cart.freeShippingThreshold - this.subtotal()),
  );

  close(): void {
    this.cartService.closeMiniCart();
  }

  increment(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity + 1);
  }

  decrement(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity - 1);
  }

  remove(itemId: string): void {
    this.cartService.removeItem(itemId);
  }
}

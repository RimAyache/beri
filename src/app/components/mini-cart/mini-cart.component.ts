import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/cart/cart.service';

const FREE_SHIPPING_THRESHOLD = 75;
const GIFT_WRAP_PRICE = 10;

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

  readonly giftWrap = signal(false);

  readonly amountToFreeShipping = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - this.subtotal()),
  );
  readonly total = computed(() => this.subtotal() + (this.giftWrap() ? GIFT_WRAP_PRICE : 0));

  close(): void {
    this.cartService.closeMiniCart();
  }

  toggleGiftWrap(): void {
    this.giftWrap.update((wrapped) => !wrapped);
  }

  increment(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  decrement(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity - 1);
  }

  remove(productId: number): void {
    this.cartService.removeItem(productId);
  }
}

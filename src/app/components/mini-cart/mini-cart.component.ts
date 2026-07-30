import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { config } from '../../config';
import { CartService } from '../../core/cart/cart.service';

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
  readonly giftWrapPrice = config.cart.giftWrapPrice;

  readonly amountToFreeShipping = computed(() =>
    Math.max(0, config.cart.freeShippingThreshold - this.subtotal()),
  );
  readonly total = computed(
    () => this.subtotal() + (this.giftWrap() ? config.cart.giftWrapPrice : 0),
  );

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

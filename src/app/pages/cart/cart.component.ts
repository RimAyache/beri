import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/cart/cart.service';

const GIFT_WRAP_PRICE = 10;

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  protected readonly items = this.cartService.items;
  protected readonly subtotal = this.cartService.subtotal;

  /* Gift wrap is display-only, same as the mini-cart's — nothing persists it. */
  protected readonly giftWrap = signal(false);
  protected readonly giftWrapPrice = GIFT_WRAP_PRICE;

  protected readonly total = computed(
    () => this.subtotal() + (this.giftWrap() ? GIFT_WRAP_PRICE : 0),
  );

  protected lineTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  protected toggleGiftWrap(): void {
    this.giftWrap.update((wrapped) => !wrapped);
  }

  protected increment(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  protected decrement(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity - 1);
  }

  protected remove(productId: number): void {
    this.cartService.removeItem(productId);
  }
}

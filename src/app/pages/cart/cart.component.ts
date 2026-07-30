import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/cart/cart.service';

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

  protected lineTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  protected increment(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity + 1);
  }

  protected decrement(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity - 1);
  }

  protected remove(itemId: string): void {
    this.cartService.removeItem(itemId);
  }
}

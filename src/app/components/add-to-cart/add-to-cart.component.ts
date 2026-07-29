import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../core/cart/cart.service';
import { ToastService } from '../../core/toast/toast.service';
import { Product } from '../../models/product.model';

export interface AddToCartEvent {
  product: Product;
  quantity: number;
}

const MAX_QUANTITY = 10;

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css',
})
export class AddToCartComponent {
  @Input({ required: true }) product!: Product;
  @Input() disabled = false;

  @Output() addToCart = new EventEmitter<AddToCartEvent>();

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  readonly isLoggedIn = this.authService.isLoggedIn;

  quantity = signal(0);
  private maxReached = signal(false);
  private unavailable = signal(false);

  isIncrementDisabled(): boolean {
    return this.disabled || this.unavailable() || this.maxReached();
  }

  isDecrementDisabled(): boolean {
    return this.disabled || this.unavailable();
  }

  increment(): void {
    if (this.isIncrementDisabled()) {
      return;
    }

    if (!this.product.available) {
      this.unavailable.set(true);
      this.toastService.show('This item is no longer available.');
      return;
    }

    this.quantity.update((q) => q + 1);
    this.cartService.addItem(this.product, this.quantity()).subscribe();
    this.addToCart.emit({ product: this.product, quantity: this.quantity() });

    if (this.quantity() >= MAX_QUANTITY) {
      this.maxReached.set(true);
      this.toastService.show('You have reached the maximum number of items.');
    }
  }

  decrement(): void {
    if (this.isDecrementDisabled()) {
      return;
    }

    this.quantity.update((q) => Math.max(0, q - 1));
    this.maxReached.set(false);
  }
}

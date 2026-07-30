import { Component, inject, input, output, signal } from '@angular/core';

import { config } from '../../config';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../core/cart/cart.service';
import { ToastService } from '../../core/toast/toast.service';
import { Product } from '../../models/product.model';

export interface AddToCartEvent {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css',
})
export class AddToCartComponent {
  product = input.required<Product>();
  disabled = input(false);

  showAddButton = input(false);

  addToCart = output<AddToCartEvent>();

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  readonly isLoggedIn = this.authService.isLoggedIn;

  quantity = signal(0);
  private maxReached = signal(false);
  private unavailable = signal(false);

  isIncrementDisabled(): boolean {
    return this.disabled() || this.unavailable() || this.maxReached();
  }

  isDecrementDisabled(): boolean {
    return this.disabled() || this.unavailable() || this.quantity() === 0;
  }

  isAddDisabled(): boolean {
    return this.disabled() || this.unavailable() || this.quantity() === 0;
  }

  increment(): void {
    if (this.isIncrementDisabled()) {
      return;
    }

    if (!this.product().available) {
      this.unavailable.set(true);
      this.toastService.show('This item is no longer available.');
      return;
    }

    this.quantity.update((q) => q + 1);

    if (!this.showAddButton()) {
      this.pushToCart(this.quantity());
      this.addToCart.emit({ product: this.product(), quantity: this.quantity() });
    }

    if (this.quantity() >= config.cart.maxQuantityPerItem) {
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

  /** Commits the picked quantity to the cart, then resets the stepper to 0. */
  addSelectedToCart(): void {
    if (this.isAddDisabled()) {
      return;
    }

    const selected = this.quantity();
    const alreadyInCart = this.cartService.getQuantity(this.product().id);
    const total = Math.min(alreadyInCart + selected, config.cart.maxQuantityPerItem);

    this.pushToCart(total);
    this.addToCart.emit({ product: this.product(), quantity: selected });

    this.quantity.set(0);
    this.maxReached.set(false);
  }

  private pushToCart(quantity: number): void {
    this.cartService
      .addItem(this.product(), quantity)
      .subscribe(() => this.cartService.openMiniCart());
  }
}

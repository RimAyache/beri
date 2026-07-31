import { Component, computed, inject, input, linkedSignal, output } from '@angular/core';

import { config } from '../../config';
import { AuthService } from '../../../core/auth/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AddToCartEvent, CartVariant } from '../../interfaces/cart.interface';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css',
})
export class AddToCartComponent {
  product = input.required<Product>();
  disabled = input(false);

  showAddButton = input(false);

  size = input<string | null>(null);
  color = input<string | null>(null);

  private readonly variant = computed<CartVariant>(() => ({
    size: this.size() ?? this.product().sizes?.[0] ?? null,
    color: this.color() ?? this.product().colors?.[0] ?? null,
  }));

  addToCart = output<AddToCartEvent>();

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  readonly isLoggedIn = this.authService.isLoggedIn;
  
  quantity = linkedSignal<Product, number>({ source: this.product, computation: () => 0 });
  private maxReached = linkedSignal<Product, boolean>({
    source: this.product,
    computation: () => false,
  });
  private unavailable = linkedSignal<Product, boolean>({
    source: this.product,
    computation: () => false,
  });

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

  addSelectedToCart(): void {
    if (this.isAddDisabled()) {
      return;
    }

    const selected = this.quantity();
    const alreadyInCart = this.cartService.getQuantity(this.product().id, this.variant());
    const total = Math.min(alreadyInCart + selected, config.cart.maxQuantityPerItem);

    this.pushToCart(total);
    this.addToCart.emit({ product: this.product(), quantity: selected });

    this.quantity.set(0);
    this.maxReached.set(false);
  }

  private pushToCart(quantity: number): void {
    this.cartService
      .addItem(this.product(), quantity, this.variant())
      .subscribe(() => this.cartService.openMiniCart());
  }
}

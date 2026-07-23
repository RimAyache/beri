import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

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
  @Input({ required: true }) product!: Product;
  @Input() disabled = false;

  @Output() addToCart = new EventEmitter<AddToCartEvent>();

  quantity = signal(1);

  increment(): void {
    this.quantity.update((q) => q + 1);
  }

  decrement(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  onAddToCart(): void {
    if (this.disabled) {
      return;
    }

    this.addToCart.emit({ product: this.product, quantity: this.quantity() });
    this.quantity.set(1);
  }
}

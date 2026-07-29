import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { config } from '../../config';
import { Product } from '../../models/product.model';
import { CartItem, CartItemResponse } from '../../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);

  private readonly cartItems = signal<Map<number, CartItem>>(new Map());
  readonly items = computed(() => [...this.cartItems().values()]);
  readonly itemCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  readonly isMiniCartOpen = signal(false);

  openMiniCart(): void {
    this.isMiniCartOpen.set(true);
  }

  closeMiniCart(): void {
    this.isMiniCartOpen.set(false);
  }

  toggleMiniCart(): void {
    this.isMiniCartOpen.update((open) => !open);
  }

  addItem(product: Product, quantity: number): Observable<CartItemResponse> {
    return this.http
      .post<CartItemResponse>(`${config.apiUrl}/cart`, { productId: product.id, quantity })
      .pipe(
        tap(() => {
          this.setLocalQuantity(product, quantity);
        }),
      );
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems().get(productId);
    if (!item) {
      return;
    }

    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.setLocalQuantity(item.product, quantity);
  }

  removeItem(productId: number): void {
    this.cartItems.update((map) => {
      const next = new Map(map);
      next.delete(productId);
      return next;
    });
  }

  private setLocalQuantity(product: Product, quantity: number): void {
    this.cartItems.update((map) => new Map(map).set(product.id, { product, quantity }));
  }
}

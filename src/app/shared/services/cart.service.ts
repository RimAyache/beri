import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

import { config } from '../../config';
import { Product } from '../../models/product.model';
import { CartItem, CartItemResponse, CartVariant } from '../../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);

  private readonly cartItems = signal<Map<string, CartItem>>(this.readStoredItems());
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

  getQuantity(productId: number, variant: CartVariant): number {
    return this.cartItems().get(this.itemId(productId, variant))?.quantity ?? 0;
  }

  addItem(product: Product, quantity: number, variant: CartVariant): Observable<CartItemResponse> {
    return this.http
      .post<CartItemResponse>(`${config.apiUrl}/cart`, {
        productId: product.id,
        quantity,
        ...variant,
      })
      .pipe(
        tap(() => this.setLocalQuantity(product, quantity, variant)),
        catchError(() => {
          this.setLocalQuantity(product, quantity, variant);
          return of({ productId: product.id, quantity });
        }),
      );
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems().get(itemId);
    if (!item) {
      return;
    }

    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.setLocalQuantity(item.product, quantity, item);
  }

  removeItem(itemId: string): void {
    const next = new Map(this.cartItems());
    next.delete(itemId);
    this.writeItems(next);
  }

  clearCart(): void {
    this.writeItems(new Map());
  }

  private itemId(productId: number, variant: CartVariant): string {
    return `${productId}|${variant.size ?? ''}|${variant.color ?? ''}`;
  }

  private setLocalQuantity(product: Product, quantity: number, variant: CartVariant): void {
    const id = this.itemId(product.id, variant);

    this.writeItems(
      new Map(this.cartItems()).set(id, {
        id,
        product,
        quantity,
        size: variant.size,
        color: variant.color,
      }),
    );
  }

  private writeItems(items: Map<string, CartItem>): void {
    this.cartItems.set(items);

    try {
      localStorage.setItem(config.cart.storageKey, JSON.stringify([...items.values()]));
    } catch {
    }
  }

  private readStoredItems(): Map<string, CartItem> {
    try {
      const stored = localStorage.getItem(config.cart.storageKey);
      const items: unknown = stored ? JSON.parse(stored) : null;

      if (!Array.isArray(items)) {
        return new Map();
      }

      return new Map((items as CartItem[]).map((item) => [item.id, item]));
    } catch {
      return new Map();
    }
  }
}

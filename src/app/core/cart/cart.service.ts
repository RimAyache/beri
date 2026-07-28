import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { config } from '../../config';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);

  private readonly quantities = signal<Map<number, number>>(new Map());
  readonly itemCount = computed(() =>
    [...this.quantities().values()].reduce((total, quantity) => total + quantity, 0),
  );

  addItem(product: Product, quantity: number): Observable<any> {
    return this.http.post(`${config.apiUrl}/cart`, { productId: product.id, quantity }).pipe(
      tap(() => {
        this.quantities.update((map) => new Map(map).set(product.id, quantity));
      }),
    );
  }
}

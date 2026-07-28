import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../../models/product.model';
import { endpoint } from '../auth';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);

  addItem(product: Product, quantity: number): Observable<any> {
    return this.http.post(`${endpoint.baseUrl}/cart`, { productId: product.id, quantity });
  }
}

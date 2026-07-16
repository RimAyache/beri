import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://fakestoreapi.com/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
}

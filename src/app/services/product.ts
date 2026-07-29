import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { config } from '../config';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${config.productsApiUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Omit<Product, 'available'>[]>(this.baseUrl)
      .pipe(map((products) => products.map((product) => ({ ...product, available: true }))));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http
      .get<Omit<Product, 'available'>[]>(`${this.baseUrl}/category/${category}`)
      .pipe(map((products) => products.map((product) => ({ ...product, available: true }))));
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }
}

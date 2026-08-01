import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { config } from '../config';
import { Product, ProductExtras } from '../interfaces/product.interface';
import productsData from '../data/products.json';

const PRODUCT_EXTRAS: Record<number, ProductExtras> = Object.fromEntries(
  productsData.map(({ id, quantity, colors, sizes }) => [id, { quantity, colors, sizes }]),
);

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${config.productsApiUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Omit<Product, 'available'>[]>(this.baseUrl).pipe(
      map((products) =>
        products.map((product) => ({
          ...product,
          available: true,
          ...PRODUCT_EXTRAS[product.id],
        })),
      ),
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Omit<Product, 'available'>>(`${this.baseUrl}/${id}`).pipe(
      map((product) => ({
        ...product,
        available: true,
        ...PRODUCT_EXTRAS[product.id],
      })),
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Omit<Product, 'available'>[]>(`${this.baseUrl}/category/${category}`).pipe(
      map((products) =>
        products.map((product) => ({
          ...product,
          available: true,
          ...PRODUCT_EXTRAS[product.id],
        })),
      ),
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  updateProduct(id: number, changes: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, changes);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

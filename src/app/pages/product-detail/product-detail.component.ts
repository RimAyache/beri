import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';

import { AddToCartComponent } from '../../components/add-to-cart/add-to-cart.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product';

const STAR_COUNT = 5;
const RELATED_PRODUCTS_LIMIT = 4;
const DISCOUNT_PERCENT = 20;
const STOCK_BAR_REFERENCE = 50;
const DEMO_COUNTDOWN = '05:23:47';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, AddToCartComponent, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  private readonly productService = inject(ProductService);

  readonly id = input.required<string>();

  private readonly productId = computed(() => Number(this.id()));

  protected readonly product = toSignal(
    toObservable(this.productId).pipe(switchMap((id) => this.productService.getProduct(id))),
    { initialValue: null },
  );

  protected readonly relatedProducts = toSignal(
    toObservable(this.product).pipe(
      switchMap((product) =>
        product ? this.productService.getProductsByCategory(product.category) : of([]),
      ),
      map((products) =>
        products
          .filter((product) => product.id !== this.productId())
          .slice(0, RELATED_PRODUCTS_LIMIT),
      ),
    ),
    { initialValue: [] },
  );

  protected readonly selectedSize = signal<string | null>(null);
  protected readonly selectedColor = signal<string | null>(null);

  protected readonly originalPrice = computed(() => {
    const product = this.product();
    return product ? product.price / (1 - DISCOUNT_PERCENT / 100) : 0;
  });

  protected readonly stockBarWidth = computed(() => {
    const quantity = this.product()?.quantity ?? 0;
    return Math.min(100, (quantity / STOCK_BAR_REFERENCE) * 100);
  });

  protected readonly discountPercent = DISCOUNT_PERCENT;
  protected readonly countdown = DEMO_COUNTDOWN;

  readonly stars = Array.from({ length: STAR_COUNT }, (_, i) => i);

  protected starFillPercent(rate: number, index: number): number {
    return Math.min(100, Math.max(0, (rate - index) * 100));
  }

  protected selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  protected selectColor(color: string): void {
    this.selectedColor.set(color);
  }
}

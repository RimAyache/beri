import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

import { AddToCartComponent } from '../../components/add-to-cart/add-to-cart.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { config } from '../../config';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, AddToCartComponent, ProductCardComponent],
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
          .slice(0, config.productDetail.relatedProductsLimit),
      ),
    ),
    { initialValue: [] },
  );

  protected readonly selectedSize = signal<string | null>(null);
  protected readonly selectedColor = signal<string | null>(null);

  protected readonly originalPrice = computed(() => {
    const product = this.product();
    return product
      ? product.price / (1 - config.productDetail.discountPercent / config.percentMax)
      : 0;
  });

  protected readonly stockBarWidth = computed(() => {
    const quantity = this.product()?.quantity ?? 0;
    return Math.min(
      config.percentMax,
      (quantity / config.productDetail.stockBarReference) * config.percentMax,
    );
  });

  protected readonly discountPercent = config.productDetail.discountPercent;
  protected readonly countdown = config.productDetail.demoCountdown;

  readonly stars = Array.from({ length: config.rating.starCount }, (_, i) => i);

  protected starFillPercent(rate: number, index: number): number {
    return Math.min(config.percentMax, Math.max(0, (rate - index) * config.percentMax));
  }

  protected selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  protected selectColor(color: string): void {
    this.selectedColor.set(color);
  }
}

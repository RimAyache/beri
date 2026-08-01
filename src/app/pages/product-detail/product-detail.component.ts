import { CurrencyPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

import { AddToCartComponent } from '../../shared/components/add-to-cart/add-to-cart.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { config } from '../../shared/config';
import { Product } from '../../shared/interfaces/product.interface';
import { ProductService } from '../../shared/services/product.service';

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

  protected readonly selectedSize = linkedSignal<Product | null, string | null>({
    source: this.product,
    computation: (product) => product?.sizes?.[0] ?? null,
  });

  protected readonly selectedColor = linkedSignal<Product | null, string | null>({
    source: this.product,
    computation: (product) => product?.colors?.[0] ?? null,
  });

  private readonly remainingSeconds = linkedSignal<number, number>({
    source: this.productId,
    computation: () => config.productDetail.saleCountdownSeconds,
  });

  protected readonly countdown = computed(() => {
    const secondsPerHour = config.time.secondsPerMinute * config.time.minutesPerHour;
    const remaining = this.remainingSeconds();

    return [
      Math.floor(remaining / secondsPerHour),
      Math.floor((remaining % secondsPerHour) / config.time.secondsPerMinute),
      remaining % config.time.secondsPerMinute,
    ]
      .map((part) => String(part).padStart(config.time.clockDigits, '0'))
      .join(':');
  });

  constructor() {
    const ticker = setInterval(
      () => this.remainingSeconds.update((remaining) => Math.max(0, remaining - 1)),
      config.time.tickIntervalMs,
    );

    inject(DestroyRef).onDestroy(() => clearInterval(ticker));
  }

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

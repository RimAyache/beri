import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { Product } from '../../models/product.model';

const STAR_COUNT = 5;

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, AddToCartComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  readonly stars = Array.from({ length: STAR_COUNT }, (_, i) => i);

  starFillPercent(index: number): number {
    const rate = this.product.rating?.rate ?? 0;
    return Math.min(100, Math.max(0, (rate - index) * 100));
  }
}

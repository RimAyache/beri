import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { config } from '../../config';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, AddToCartComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();

  readonly stars = Array.from({ length: config.rating.starCount }, (_, i) => i);

  starFillPercent(index: number): number {
    const rate = this.product().rating?.rate ?? 0;
    return Math.min(config.percentMax, Math.max(0, (rate - index) * config.percentMax));
  }
}

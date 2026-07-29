import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';

interface ICategoryPill {
  label: string;
  category: string | null;
}

const FEATURED_COUNT = 6;

const CATEGORIES: ICategoryPill[] = [
  { label: "Men's Fashion", category: "men's clothing" },
  { label: "Women's Fashion", category: "women's clothing" },
  { label: 'Jewelry', category: 'jewelery' },
  { label: 'Electronics', category: 'electronics' },
  { label: 'Discount Deals', category: null },
];

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  readonly categories = CATEGORIES;
  readonly featuredCount = FEATURED_COUNT;
  readonly selectedCategory = signal<ICategoryPill>(CATEGORIES[0]);

  private readonly products$ = toObservable(this.selectedCategory).pipe(
    switchMap((pill) =>
      pill.category
        ? this.productService.getProductsByCategory(pill.category)
        : this.productService.getProducts(),
    ),
  );

  readonly featuredProducts = toSignal(this.products$, { initialValue: [] as Product[] });

  selectCategory(pill: ICategoryPill): void {
    this.selectedCategory.set(pill);
  }
}

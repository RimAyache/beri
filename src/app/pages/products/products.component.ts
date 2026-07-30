import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { PriceBucket, config } from '../../config';
import { ProductService } from '../../services/product';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, TitleCasePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);

  protected readonly priceBuckets = config.shop.priceBuckets;
  protected readonly sortOptions = SORT_OPTIONS;

  private readonly products = toSignal(this.productService.getProducts(), { initialValue: [] });
  protected readonly categories = toSignal(this.productService.getCategories(), {
    initialValue: [],
  });

  protected readonly selectedCategory = signal<string | null>(null);
  protected readonly selectedPriceBucket = signal<PriceBucket | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly sortBy = signal<SortOption>('default');
  protected readonly currentPage = signal(1);

  protected readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const priceBucket = this.selectedPriceBucket();
    const search = this.searchTerm().trim().toLowerCase();
    const sort = this.sortBy();

    let result = this.products();

    if (category) {
      result = result.filter((product) => product.category === category);
    }

    if (priceBucket) {
      result = result.filter(
        (product) =>
          product.price >= priceBucket.min &&
          (priceBucket.max === null || product.price < priceBucket.max),
      );
    }

    if (search) {
      result = result.filter((product) => product.title.toLowerCase().includes(search));
    }

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating.rate - a.rating.rate);
        break;
    }

    return result;
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / config.shop.pageSize)),
  );

  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  protected readonly pagedProducts = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * config.shop.pageSize;
    return this.filteredProducts().slice(start, start + config.shop.pageSize);
  });

  protected selectCategory(category: string | null): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  protected selectPriceBucket(bucket: PriceBucket | null): void {
    this.selectedPriceBucket.set(bucket);
    this.currentPage.set(1);
  }

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  protected onSortChange(sort: SortOption): void {
    this.sortBy.set(sort);
    this.currentPage.set(1);
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
  }
}

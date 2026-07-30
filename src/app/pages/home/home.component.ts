import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { config } from '../../config';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';

interface ICategoryPill {
  label: string;
  category: string;
}

interface IHeroBanner {
  eyebrow: string;
  title: string;
  modifier: string;
  category: string;
}

const CATEGORIES: ICategoryPill[] = [
  { label: "Men's Fashion", category: "men's clothing" },
  { label: "Women's Fashion", category: "women's clothing" },
  { label: 'Jewelry', category: 'jewelery' },
  { label: 'Electronics', category: 'electronics' },
];

const HERO_BANNERS: IHeroBanner[] = [
  {
    eyebrow: 'Ultimate Sale',
    title: 'New Collection',
    modifier: 'sale',
    category: "women's clothing",
  },
  { eyebrow: 'Everyday Essentials', title: 'Menswear', modifier: 'accent', category: "men's clothing" },
  { eyebrow: 'Timeless Pieces', title: 'Fine Jewelry', modifier: 'dark', category: 'jewelery' },
];

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, RouterLink, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  readonly categories = CATEGORIES;
  readonly featuredCount = config.home.featuredProductCount;
  readonly freeShippingThreshold = config.cart.freeShippingThreshold;
  readonly selectedCategory = signal<ICategoryPill>(CATEGORIES[0]);

  private readonly products$ = toObservable(this.selectedCategory).pipe(
    switchMap((pill) => this.productService.getProductsByCategory(pill.category)),
  );

  readonly featuredProducts = toSignal(this.products$, { initialValue: [] as Product[] });

  /** Full catalog, used only to source real imagery for the banners and the gallery strip. */
  private readonly catalog = toSignal(this.productService.getProducts(), {
    initialValue: [] as Product[],
  });

  readonly heroBanners = computed(() =>
    HERO_BANNERS.map((banner) => ({
      ...banner,
      image: this.catalog().find((product) => product.category === banner.category)?.image ?? null,
    })),
  );

  /** Takes products from the end of the catalog so the strip does not repeat the featured grid. */
  readonly galleryImages = computed(() =>
    this.catalog()
      .slice(-config.home.galleryTileCount)
      .map((product) => ({ id: product.id, image: product.image, title: product.title })),
  );

  selectCategory(pill: ICategoryPill): void {
    this.selectedCategory.set(pill);
  }
}

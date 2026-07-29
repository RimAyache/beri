import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);

  products = toSignal(this.productService.getProducts(), { initialValue: [] });
}

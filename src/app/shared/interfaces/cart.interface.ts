import { Product } from './product.model';

export interface CartVariant {
  size: string | null;
  color: string | null;
}

export interface CartItem extends CartVariant {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartItemResponse {
  productId: number;
  quantity: number;
}

export interface AddToCartEvent {
  product: Product;
  quantity: number;
}

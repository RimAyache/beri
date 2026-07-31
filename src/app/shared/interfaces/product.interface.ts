export interface ProductRating {
  rate: number;
  count: number;
}

export type ProductExtras = Pick<Product, 'quantity' | 'colors' | 'sizes'>;

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
  available: boolean;
  quantity?: number;
  sizes?: string[];
  colors?: string[];
}

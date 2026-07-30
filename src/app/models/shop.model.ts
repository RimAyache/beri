export interface PriceBucket {
  label: string;
  min: number;
  max: number | null;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export interface SortChoice {
  label: string;
  value: SortOption;
}

export type SortKey = 'price-asc' | 'price-desc' | 'duration-asc' | 'durations-desc';

export type Filters = {
  priceMin: number | null;
  priceMax: number | null;
  durationMaxMinutes: number | null;
  connections: number[];
};

export const EMPTY_FILTERS: Filters = {
  priceMin: null,
  priceMax: null,
  durationMaxMinutes: null,
  connections: [],
};

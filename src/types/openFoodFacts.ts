// src/types/openFoodFacts.ts
export type Nutriments = Record<string, number | string | undefined>;

export interface OFFProduct {
  code?: string;
  product_name?: string;
  image_url?: string;
  brands?: string;
  categories?: string;
  nutriments?: Nutriments;
  // add other fields you need later
}

export interface OFFApiResponse {
  status?: number;
  status_verbose?: string;
  product?: OFFProduct;
}

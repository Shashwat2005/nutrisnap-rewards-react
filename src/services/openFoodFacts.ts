// src/services/openFoodFacts.ts
import type { OFFApiResponse, OFFProduct } from "../types/openFoodFacts";

const PRODUCT_BASE = "https://world.openfoodfacts.org/api/v2/product";
const SEARCH_BASE = "https://world.openfoodfacts.org/cgi/search.pl";
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

type CacheEntry = { ts: number; value: any };
const cache = new Map<string, CacheEntry>();

export async function fetchProductByBarcode(barcode: string): Promise<OFFProduct | null> {
  const code = barcode.trim();
  if (!code) return null;
  const url = `${PRODUCT_BASE}/${encodeURIComponent(code)}.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as OFFApiResponse;
    return data?.product ?? null;
  } catch {
    return null;
  }
}

/**
 * Search products by keyword (returns products[]).
 * page_size default 10. Supports simple client-side caching.
 */
export async function searchProducts(query: string, page_size = 10, page = 1): Promise<OFFProduct[]> {
  const q = query.trim();
  if (!q) return [];

  const key = `search:${q.toLowerCase()}:p${page}:s${page_size}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.value as OFFProduct[];
  }

  const url = `${SEARCH_BASE}?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=${page_size}&page=${page}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const products = (data?.products ?? []) as OFFProduct[];
    cache.set(key, { ts: Date.now(), value: products });
    return products;
  } catch {
    return [];
  }
}

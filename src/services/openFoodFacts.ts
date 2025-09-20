// src/services/openFoodFacts.ts
import type { OFFApiResponse, OFFProduct } from "../types/openFoodFacts";

const BASE = "https://world.openfoodfacts.org/api/v2/product";
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

type CacheEntry = { ts: number; product: OFFProduct | null };
const cache = new Map<string, CacheEntry>();

/**
 * Fetch product data by barcode.
 * - Uses in-memory cache
 * - Aborts after timeoutMs
 */
export async function fetchProductByBarcode(
  barcode: string,
  timeoutMs = 8000
): Promise<OFFProduct | null> {
  const code = barcode.trim();
  if (!code) return null;

  // return from cache if fresh
  const cached = cache.get(code);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.product;
  }

  const url = `${BASE}/${encodeURIComponent(code)}.json`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) {
      // network error
      console.error("OpenFoodFacts network error", res.status);
      cache.set(code, { ts: Date.now(), product: null });
      return null;
    }

    const data = (await res.json()) as OFFApiResponse;

    // The API returns data.product when found
    const product = data?.product ?? null;
    cache.set(code, { ts: Date.now(), product });
    return product;
  } catch (err) {
    clearTimeout(id);
    if ((err as any)?.name === "AbortError") {
      console.error("OpenFoodFacts request aborted (timeout)");
    } else {
      console.error("OpenFoodFacts fetch error", err);
    }
    cache.set(code, { ts: Date.now(), product: null });
    return null;
  }
}

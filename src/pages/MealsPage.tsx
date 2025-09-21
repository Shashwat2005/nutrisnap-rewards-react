// src/pages/MealsPage.tsx
import React, { useCallback, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { searchProducts } from "../services/openFoodFacts";
import type { OFFProduct } from "../types/openFoodFacts";
import ProductCard from "../components/ProductCard";

export default function MealsPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 450);

  const [results, setResults] = useState<OFFProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(false);

  // When debounced query changes, reset page and results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setPage(1);
      setHasMore(false);
      setError(null);
      return;
    }

    let isCanceled = false;
    async function doSearch() {
      setLoading(true);
      setError(null);
      try {
        const prods = await searchProducts(debouncedQuery, pageSize, 1);
        if (isCanceled) return;
        setResults(prods);
        setPage(1);
        setHasMore((prods.length ?? 0) >= pageSize);
      } catch (e) {
        if (isCanceled) return;
        setError("Error fetching products.");
        setResults([]);
        setHasMore(false);
      } finally {
        if (!isCanceled) setLoading(false);
      }
    }

    doSearch();

    return () => {
      isCanceled = true;
    };
  }, [debouncedQuery]);

  // load more (next page)
  const loadMore = useCallback(async () => {
    if (!debouncedQuery.trim()) return;
    const nextPage = page + 1;
    setLoading(true);
    try {
      const more = await searchProducts(debouncedQuery, pageSize, nextPage);
      setResults((prev) => [...prev, ...more]);
      setPage(nextPage);
      setHasMore(more.length >= pageSize);
    } catch {
      setError("Failed to load more.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page]);

  // Add product to today's meal (placeholder)
  const handleAdd = (product: OFFProduct) => {
    // TODO: connect to Supabase or local state to add product to user's meal
    console.log("Add product to meal:", product.code || product.product_name);
    // Example: call an API to save to DB, or update local state
  };

  // Select product for details
  const handleSelect = (product: OFFProduct) => {
    // e.g., open modal / details panel
    console.log("Selected product", product);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Meals</h1>

      {/* Existing search bar area — you can replace your input with this one */}
      <div className="flex gap-2 items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search meals or products (e.g. Oreo, Pepsi)"
          className="flex-1 border rounded px-3 py-2"
          aria-label="Search meals and products"
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("");
          }}
        />
        <button
          onClick={() => {
            // annoying: immediate search without waiting debounce
            // set debounced value by temporarily toggling query (not needed usually)
            // or you can just set debouncedQuery via a ref/hook — we keep it simple:
            // force immediate fetch by setting query => debounce handles it automatically
            setQuery((q) => q); // no-op; user can press Enter, debounce will run
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Status */}
      <div className="mt-3">
        {loading && <div className="text-sm text-gray-600">Searching...</div>}
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        {!loading && !results.length && debouncedQuery && (
          <div className="mt-2 text-sm text-gray-600">No products found.</div>
        )}
      </div>

      {/* Results */}
      <div className="mt-6 space-y-3">
        {results.map((p) => (
          <ProductCard
            key={p.code ?? p.product_name}
            product={p}
            onAdd={handleAdd}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 rounded border"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

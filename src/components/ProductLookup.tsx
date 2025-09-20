// src/components/ProductLookup.tsx
import React, { useState } from "react";
import { fetchProductByBarcode } from "../services/openFoodFacts";
import type { OFFProduct } from "../types/openFoodFacts";

export default function ProductLookup() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<OFFProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeGetNutriment = (key: string) => {
    return product?.nutriments?.[key] ?? "N/A";
  };

  async function handleSearch() {
    setError(null);
    setProduct(null);

    const code = barcode.trim();
    if (!code) {
      setError("Please enter a barcode.");
      return;
    }

    setLoading(true);
    try {
      const p = await fetchProductByBarcode(code);
      if (!p) {
        setError("Product not found.");
        setProduct(null);
      } else {
        setProduct(p);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching product data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Nutrition Lookup</h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          placeholder="Enter barcode (e.g. 5449000000996)"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Barcode input"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {product && (
        <div className="mt-6 border rounded p-4 shadow-sm">
          <div className="flex items-start gap-4">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.product_name ?? "product image"}
                className="w-28 h-28 object-contain rounded"
              />
            )}
            <div>
              <h2 className="text-lg font-bold">{product.product_name ?? "Unnamed product"}</h2>
              {product.brands && <div className="text-sm text-muted-foreground">{product.brands}</div>}
              <div className="mt-2 text-sm">
                <div><strong>Calories (kcal/100g):</strong> {safeGetNutriment("energy-kcal_100g")}</div>
                <div><strong>Sugars (g/100g):</strong> {safeGetNutriment("sugars_100g")}</div>
                <div><strong>Fat (g/100g):</strong> {safeGetNutriment("fat_100g")}</div>
                <div><strong>Proteins (g/100g):</strong> {safeGetNutriment("proteins_100g")}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

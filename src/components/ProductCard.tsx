// src/components/ProductCard.tsx
import React from "react";
import type { OFFProduct } from "../types/openFoodFacts";

type Props = {
  product: OFFProduct;
  onAdd?: (product: OFFProduct) => void;
  onSelect?: (product: OFFProduct) => void;
};

export default function ProductCard({ product, onAdd, onSelect }: Props) {
  const name = product.product_name || (product as any).generic_name || "Unnamed product";
  const brand = product.brands ?? "Unknown brand";

  const kcal = product.nutriments?.["energy-kcal_100g"] ?? product.nutriments?.["energy-kcal"];

  return (
    <div className="flex gap-4 border rounded p-3 shadow-sm items-start">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
        {product.image_url ? (
          // image
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={name} className="object-contain w-full h-full" />
        ) : (
          <div className="text-xs text-gray-500">No image</div>
        )}
      </div>

      <div className="flex-1">
        <button onClick={() => onSelect?.(product)} className="text-left w-full">
          <h3 className="text-sm font-semibold">{name}</h3>
          <div className="text-xs text-gray-600">{brand}</div>
        </button>

        <div className="mt-2 text-xs text-gray-700">
          <div>Calories (kcal/100g): {kcal ?? "N/A"}</div>
          <div>Sugars (g/100g): {product.nutriments?.["sugars_100g"] ?? "N/A"}</div>
        </div>
      </div>

      <div>
        <button
          onClick={() => onAdd?.(product)}
          className="px-3 py-1 rounded bg-green-600 text-white text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
}

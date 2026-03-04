"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { Product, ProductCategory } from "@/types/cms";

type MenuCatalogProps = {
  categories: ProductCategory[];
  products: Product[];
};

export function MenuCatalog({ categories, products }: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }
    return products.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory, products]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveCategory("all");
            trackEvent("view_category", { category: "all" });
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            activeCategory === "all" ? "bg-cocoa-700 text-white" : "border border-rose-200 bg-white text-cocoa-700"
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              trackEvent("view_category", { category: category.name });
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              activeCategory === category.id
                ? "bg-cocoa-700 text-white"
                : "border border-rose-200 bg-white text-cocoa-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="rounded-lg bg-white/80 p-6 shadow-panel transition duration-500 hover:-translate-y-1 hover:shadow-soft"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-rose-500">{product.imageHint}</p>
            <h3 className="mt-2 font-serifBrand text-2xl text-cocoa-800">{product.name}</h3>
            <p className="mt-2 text-sm text-cocoa-700">{product.description}</p>
            <p className="mt-3 text-sm font-semibold text-cocoa-800">{product.priceRange}</p>
            {product.minOrder ? <p className="mt-1 text-xs text-cocoa-700">{product.minOrder}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

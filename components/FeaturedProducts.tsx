"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { SpecialProduct } from "./ProductModalContext";
import { etrolleyApi } from "@/lib/api";

const fallbackProducts: SpecialProduct[] = [
  {
    id: 1,
    title: "Wooden Diwan",
    price: 34.3,
    originalPrice: 35.0,
    discountPercent: 2,
    rating: 0,
    reviewsCount: 0,
    image: "/home/special1.png",
    category: "Chairs",
    stock: 10,
    description:
      "Crafted with premium solid wood, this timeless wooden diwan offers classic comfort and an organic, modern aesthetic for your living room or study. Crafted with elegance...",
  },
  {
    id: 2,
    title: "Sydney Sofa",
    price: 450.0,
    originalPrice: 500.0,
    discountPercent: 10,
    rating: 0,
    reviewsCount: 0,
    image: "/home/special2.png",
    category: "Sofas",
    stock: 6,
    description:
      "Designed with plush fabric upholstery and deep seating cushioning, the Sydney Sofa brings contemporary European elegance into any living room space. Crafted with elegance...",
  },
  {
    id: 3,
    title: "Queen Arm Chair",
    price: 34.92,
    originalPrice: 36.0,
    discountPercent: 3,
    rating: 0,
    reviewsCount: 0,
    image: "/home/special3.png",
    category: "Chairs",
    stock: 12,
    description:
      "A royal tufted velvet armchair featuring ergonomic high-density padding and robust steel legs, combining luxury styling with everyday relaxation. Crafted with elegance...",
  },
  {
    id: 4,
    title: "Sheesham Settee",
    price: 29.1,
    originalPrice: 30.0,
    discountPercent: 3,
    rating: 0,
    reviewsCount: 0,
    image: "/home/special4.png",
    category: "Benches",
    stock: 10,
    description:
      "Elevate your seating area with our Sheesham Wood Settee, showcasing the natural beauty and durability of solid wood. Crafted with elegance...",
  },
  {
    id: 5,
    title: "Mushroom Lamp",
    price: 8.01,
    originalPrice: 8.9,
    discountPercent: 10,
    rating: 0,
    reviewsCount: 0,
    image: "/home/special5.png",
    category: "Lighting",
    stock: 25,
    description:
      "A charming Scandinavian mushroom dome table lamp with warm ambient illumination and a brass collar accent, ideal for nightstands and shelves. Crafted with elegance...",
  },
];

export default function FeaturedProducts({
  isWhiteTheme = false,
}: {
  isWhiteTheme?: boolean;
}) {
  const [products, setProducts] = useState<SpecialProduct[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        const res: any = await etrolleyApi.getProducts({ per_page: 5 });
        const items = res?.data?.data || (Array.isArray(res?.data) ? res.data : []);
        if (isMounted && items && items.length > 0) {
          const mapped: SpecialProduct[] = items.slice(0, 5).map((item: any, idx: number) => {
            const price = Number(item.price) || 50;
            const originalPrice = Number(item.old_price) || (price > 0 ? Number((price * 1.15).toFixed(2)) : 60);
            const discountPercent =
              originalPrice > price
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0;

            return {
              id: item.id || idx + 1,
              title: item.name || `Product ${idx + 1}`,
              price,
              originalPrice,
              discountPercent,
              rating: item.rate || 0,
              reviewsCount: item.count_rate || 0,
              image: item.image || fallbackProducts[idx % fallbackProducts.length].image,
              category: item.category || "General",
              stock: item.qty || 10,
              description: item.sub_description || item.description || "Crafted with elegance...",
            };
          });
          setProducts(mapped);
        }
      } catch (err) {
        console.warn("Could not fetch API products, using fallback:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="shop"
      className={`py-16 sm:py-24 transition-colors duration-300 ${
        isWhiteTheme ? "bg-white text-gray-900" : "bg-[#232323] text-white"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching Multikart Furniture Dark */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-[#a8a8a8] text-base sm:text-lg font-normal tracking-wide mb-1.5">
            Special Offer
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-[0.14em] uppercase text-white font-sans leading-tight">
            TOP COLLECTION
          </h2>
          <div className="w-16 h-[3px] bg-[#cca382] mx-auto my-4" />
          <p className="text-[#a5a5a5] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Find Various types of quality chairs, and international standards. only with this one website you can see and buy quality chairs. immediately order the best seat.
          </p>
        </div>

        {/* Products Grid: 2 columns on mobile (grid-cols-2), 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWhiteTheme={isWhiteTheme}
              aspectRatioClass="aspect-[1/1.08]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { fallbackProducts as specialProducts };
export type { SpecialProduct };

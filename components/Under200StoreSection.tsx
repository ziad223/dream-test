"use client";

import React from "react";
import Image from "next/image";
import ProductCard from "./ProductCard";
import { SpecialProduct } from "./ProductModalContext";

const under200Products: SpecialProduct[] = [
  {
    id: 11,
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
    id: 12,
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
    id: 13,
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
    id: 14,
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
      "Exquisite Sheesham wood crafted bench with authentic spindle back detailing and an ultra-soft padded cushion seat designed for dining and entryway settings. Crafted with elegance...",
  },
  {
    id: 15,
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
  {
    id: 16,
    title: "GlowUp Beam",
    price: 59.63,
    originalPrice: 67.0,
    discountPercent: 11,
    rating: 0,
    reviewsCount: 0,
    image: "/home/special6.png",
    category: "Lighting",
    stock: 15,
    description:
      "Modern minimalist wall sconce fixture with warm globe light and sleek brass curved arm, creating cozy atmosphere for bedrooms and hallways. Crafted with elegance...",
  },
  {
    id: 17,
    title: "OAK Coffee Table",
    price: 14.7,
    originalPrice: 15.0,
    discountPercent: 2,
    rating: 0,
    reviewsCount: 0,
    image: "/home/special7.png",
    category: "Tables",
    stock: 18,
    description:
      "Round solid natural oak tabletop on slender matte black geometric metal legs with Scandinavian craftsmanship. Crafted with elegance...",
  },
  {
    id: 18,
    title: "Wooden Center Table",
    price: 17.1,
    originalPrice: 18.0,
    discountPercent: 5,
    rating: 0,
    reviewsCount: 0,
    image: "/home/special8.png",
    category: "Tables",
    stock: 14,
    description:
      "Multi-tiered contemporary coffee table with contrasting white and deep walnut finished shelves for books, decors, and magazines. Crafted with elegance...",
  },
];

interface Under200StoreSectionProps {
  isWhiteTheme?: boolean;
}

export default function Under200StoreSection({
  isWhiteTheme = false,
}: Under200StoreSectionProps) {
  const [products, setProducts] = React.useState<SpecialProduct[]>(under200Products);

  React.useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const { etrolleyApi } = await import("@/lib/api");
        const res: any = await etrolleyApi.getProducts({ per_page: 8 });
        const items = res?.data?.data || (Array.isArray(res?.data) ? res.data : []);
        if (isMounted && items && items.length > 0) {
          const mapped: SpecialProduct[] = items.slice(0, 8).map((item: any, idx: number) => {
            const price = Number(item.price) || 29;
            const originalPrice = Number(item.old_price) || (price > 0 ? Number((price * 1.1).toFixed(2)) : 35);
            const discountPercent =
              originalPrice > price
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 5;

            return {
              id: item.id || idx + 11,
              title: item.name || `Special Item ${idx + 1}`,
              price,
              originalPrice,
              discountPercent,
              rating: item.rate || 0,
              reviewsCount: item.count_rate || 0,
              image: item.image || under200Products[idx % under200Products.length].image,
              category: item.category || "Furniture",
              stock: item.qty || 10,
              description: item.sub_description || item.description || "Crafted with elegance...",
            };
          });
          setProducts(mapped);
        }
      } catch (err) {
        console.warn("Using fallback for Under200StoreSection:", err);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className={`py-12 sm:py-16 transition-colors duration-300 ${
        isWhiteTheme ? "bg-white text-gray-900" : "bg-[#232323] text-white"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] xl:grid-cols-[290px_1fr] gap-5 lg:gap-6">
          {/* LEFT COLUMN: Full-height Tall Banner (big-banner.png) */}
          <div className="relative w-full h-[500px] lg:h-full min-h-[620px] bg-[#1a1a1a] overflow-hidden rounded-[2px] shadow-xl group cursor-pointer border border-[#2d2d2d]">
            <Image
              src="/home/big-banner.png"
              alt="Under $200 Store Banner"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none" />
          </div>

          {/* RIGHT COLUMN: 8 Products (2 columns on mobile, 4 columns on tablet/desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWhiteTheme={isWhiteTheme}
                aspectRatioClass="aspect-[1/1.05]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export { under200Products };

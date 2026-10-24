"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Search, RefreshCw, Star } from "lucide-react";
import { SpecialProduct, useProductModal } from "./ProductModalContext";

interface ProductCardProps {
  product: SpecialProduct;
  isWhiteTheme?: boolean;
  aspectRatioClass?: string;
}

export default function ProductCard({
  product,
  isWhiteTheme = false,
  aspectRatioClass = "aspect-[1/1.08]",
}: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart, openQuickView, toggleCompare, compareList } =
    useProductModal();

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.some((item) => item.id === product.id);

  return (
    <div
      className="group relative flex flex-col cursor-pointer transition-all duration-300"
      onClick={() => openQuickView(product)}
    >
      {/* Product Image Box */}
      <div
        className={`relative w-full ${aspectRatioClass} flex items-center justify-center p-5 sm:p-6 overflow-hidden transition-all duration-300 ${
          isWhiteTheme
            ? "bg-[#f7f7f7] hover:bg-[#f0f0f0]"
            : "bg-[#292929] hover:bg-[#2e2e2e]"
        }`}
      >
        {/* Vertical Action Stack on Top-Right */}
        <div
          className="absolute top-3 right-3 z-20 flex flex-col items-center space-y-1.5 sm:space-y-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Wishlist Heart Icon */}
          <button
            onClick={(e) => toggleWishlist(product, e)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
              isWishlisted
                ? "bg-[#e22a40] text-white"
                : "bg-[#333333]/90 text-white hover:bg-[#cca382] hover:text-black"
            }`}
            title="Add to Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-[17px] sm:h-[17px] transition-transform active:scale-125 ${
                isWishlisted ? "fill-white" : ""
              }`}
              strokeWidth={1.8}
            />
          </button>

          {/* 2. Cart Icon */}
          <button
            onClick={(e) => addToCart(product, 1, e)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#333333]/90 hover:bg-[#cca382] text-white hover:text-black flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer -translate-y-2 sm:-translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-75"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* 3. Quick View / Search Icon */}
          <button
            onClick={(e) => openQuickView(product, e)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#333333]/90 hover:bg-[#cca382] text-white hover:text-black flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer -translate-y-3 sm:-translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-150"
            title="Quick View"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* 4. Compare (Refresh) Icon */}
          <button
            onClick={(e) => toggleCompare(product, e)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer -translate-y-4 sm:-translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-200 ${
              isCompared
                ? "bg-[#cca382] text-black"
                : "bg-[#333333]/90 hover:bg-[#cca382] text-white hover:text-black"
            }`}
            title="Compare Product"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain"
          />
        </div>
      </div>

      {/* Product Details (Below Image) */}
      <div className="pt-3 pb-1 text-left flex flex-col gap-1.5 select-none">
        <h3 className="text-white text-base sm:text-[17px] font-semibold tracking-normal group-hover:text-[#cca382] transition-colors truncate">
          {product.title}
        </h3>

        {/* Stars Rating & Reviews Count */}
        <div className="flex items-center gap-1 text-[#ffab00]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffab00]"
              strokeWidth={1.5}
            />
          ))}
          <span className="text-xs sm:text-sm text-[#8e8e8e] ml-1">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 sm:gap-2.5 pt-0.5 flex-wrap">
          <span className="text-white font-bold text-base sm:text-lg lg:text-[19px] tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[#888888] line-through text-xs sm:text-sm lg:text-[15px]">
            ${product.originalPrice.toFixed(2)}
          </span>
          <span className="text-[#cca382] text-xs sm:text-sm lg:text-[15px] font-medium ml-0.5">
            {product.discountPercent}% Off
          </span>
        </div>
      </div>
    </div>
  );
}

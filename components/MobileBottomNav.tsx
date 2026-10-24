"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Search, ShoppingBag, Heart, User, X } from "lucide-react";
import { useProductModal } from "./ProductModalContext";

export default function MobileBottomNav() {
  const {
    setIsCartOpen,
    setIsSearchOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    cartCount,
    wishlistCount,
  } = useProductModal();

  return (
    <>
      {/* Fixed Sticky Mobile Bottom Nav Bar matching Multikart Dark */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-[80] bg-[#1a1a1a] border-t border-[#2e2e2e] shadow-2xl select-none">
        <div className="grid grid-cols-5 h-16 items-center">
          {/* 1. HOME */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-white hover:text-[#c7a78b] transition-colors py-1 group"
          >
            <Home className="w-[20px] h-[20px] stroke-[1.8] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold tracking-wider mt-1 text-white group-hover:text-[#c7a78b]">
              Home
            </span>
          </Link>

          {/* 2. SEARCH (Triggers Multikart Search in store modal) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center text-white hover:text-[#c7a78b] transition-colors py-1 group cursor-pointer"
          >
            <Search className="w-[20px] h-[20px] stroke-[1.8] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold tracking-wider mt-1 text-white group-hover:text-[#c7a78b]">
              Search
            </span>
          </button>

          {/* 3. CART (triggers My Cart slide-over drawer) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center text-white hover:text-[#c7a78b] transition-colors py-1 group cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-[20px] h-[20px] stroke-[1.8] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#cca382] text-white font-bold text-[9px] min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold tracking-wider mt-1 text-white group-hover:text-[#c7a78b]">
              Cart
            </span>
          </button>

          {/* 4. WISHLIST (triggers My Wishlist slide-over drawer) */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative flex flex-col items-center justify-center text-white hover:text-[#c7a78b] transition-colors py-1 group cursor-pointer"
          >
            <div className="relative">
              <Heart className="w-[20px] h-[20px] stroke-[1.8] group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#cca382] text-white font-bold text-[9px] min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold tracking-wider mt-1 text-white group-hover:text-[#c7a78b]">
              Wishlist
            </span>
          </button>

          {/* 5. USER (triggers Login / Register modal) */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex flex-col items-center justify-center text-white hover:text-[#c7a78b] transition-colors py-1 group cursor-pointer"
          >
            <User className="w-[20px] h-[20px] stroke-[1.8] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold tracking-wider mt-1 text-white group-hover:text-[#c7a78b]">
              User
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

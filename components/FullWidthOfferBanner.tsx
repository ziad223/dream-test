"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FullWidthOfferBannerProps {
  isWhiteTheme?: boolean;
}

export default function FullWidthOfferBanner({
  isWhiteTheme = false,
}: FullWidthOfferBannerProps) {
  return (
    <section className="w-full bg-[#4a3e37] py-6 sm:py-8 select-none">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Full-width container with 3 equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full shadow-2xl overflow-hidden min-h-[350px] sm:min-h-[400px] lg:min-h-[440px]">
          {/* 1. Left Image: banner1.png (Armchair, side table, yellow flowers) */}
          <div className="relative w-full h-[320px] sm:h-[380px] md:h-full bg-[#201d1b] overflow-hidden group">
            <Image
              src="/home/banner1.png"
              alt="Interior Armchair & Side Table"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-left group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          {/* 2. Middle Content Box: Exactly matching user image */}
          <div className="w-full h-full bg-[#2a2a2a] flex flex-col items-center justify-center text-center px-4 sm:px-8 py-10 sm:py-14">
            {/* Top Subtitle */}
            <span className="text-[#c7a78b] text-[12px] sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-2">
              NEW PRODUCTS
            </span>

            {/* Main Heading: In single line with refined font size */}
            <h2 className="text-white text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[0.06em] uppercase whitespace-nowrap my-2 font-sans">
              ZIPPER STORAGE BAG
            </h2>

            {/* Tan/Beige Discount Badge */}
            <div className="my-4 sm:my-5">
              <span className="inline-block bg-[#c7a78b] text-white font-bold text-[12px] sm:text-[13px] px-6 py-2.5 tracking-wider uppercase rounded-[1px] shadow-sm">
                -80% OFF
              </span>
            </div>

            {/* Shop Now Link */}
            <Link
              href="/collections"
              className="text-[#999999] hover:text-white text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase transition-colors pt-1 cursor-pointer inline-block"
            >
              SHOP NOW
            </Link>
          </div>

          {/* 3. Right Image: banner2.png (Egg chair on textured wall) */}
          <div className="relative w-full h-[320px] sm:h-[380px] md:h-full bg-[#201d1b] overflow-hidden group">
            <Image
              src="/home/banner2.png"
              alt="Leather Swivel Egg Chair"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

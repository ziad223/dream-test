"use client";

import React from "react";
import Image from "next/image";

interface BannerItem {
  id: number;
  discount: string;
  category: string;
  image: string;
  imageAlt: string;
}

const bannerCards: BannerItem[] = [
  {
    id: 1,
    discount: "SAVE 30%",
    category: "ACCENT",
    image: "/home/save-1.png",
    imageAlt: "White accent chair modern design",
  },
  {
    id: 2,
    discount: "SAVE 60%",
    category: "STOOL",
    image: "/home/save-2.png",
    imageAlt: "Wooden high stool bar chair",
  },
  {
    id: 3,
    discount: "SAVE 60%",
    category: "LOUNGE",
    image: "/home/save-3.png",
    imageAlt: "Light blue comfortable lounge armchair",
  },
];

export default function PromoCards() {
  return (
    <div className="relative z-20 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 md:-mt-24 lg:-mt-28 pb-12 sm:pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
        {bannerCards.map((card) => (
          <div
            key={card.id}
            className="group relative bg-[#232323] hover:bg-[#282828] transition-all duration-300 rounded-[2px] overflow-visible cursor-pointer shadow-2xl flex items-center justify-between min-h-[150px] sm:min-h-[175px] lg:min-h-[190px] px-4 sm:px-5 lg:px-6 py-2"
          >
            {/* Left Product Image rising/popping out above card */}
            <div className="relative w-32 sm:w-36 lg:w-44 h-40 sm:h-48 lg:h-56 -ml-3 sm:-ml-4 lg:-ml-5 -mt-6 sm:-mt-8 lg:-mt-12 transition-transform duration-300 ease-out group-hover:scale-105 shrink-0 pointer-events-none">
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 220px"
                className="object-contain object-bottom"
              />
            </div>

            {/* Right Offer Text with White Accent Line */}
            <div className="relative z-10 flex items-center pl-2 pr-1 select-none">
              {/* White vertical bar */}
              <div className="w-[3px] h-10 sm:h-12 lg:h-14 bg-white mr-2.5 sm:mr-3 lg:mr-4 transition-all duration-300 group-hover:bg-[#cda274]" />

              <div className="text-left">
                <span className="block text-white text-[11px] sm:text-[12px] lg:text-[13px] font-semibold tracking-wider uppercase">
                  {card.discount}
                </span>
                <span className="block text-white text-base sm:text-lg lg:text-[22px] font-black tracking-widest uppercase mt-0.5 group-hover:text-[#cda274] transition-colors leading-tight">
                  {card.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

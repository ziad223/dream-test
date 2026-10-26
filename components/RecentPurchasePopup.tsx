"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface RecentPurchaseItem {
  id: number;
  title: string;
  image: string;
  timeAgo: string;
  url: string;
}

const RECENT_PURCHASES: RecentPurchaseItem[] = [
  {
    id: 1,
    title: "Teddy & Choco Bliss Basket",
    image: "/home/special1.png",
    timeAgo: "1 Minutes Ago",
    url: "/product/details?id=1",
  },
  {
    id: 2,
    title: "Comfortable Modern Armchair",
    image: "/home/special2.png",
    timeAgo: "3 Minutes Ago",
    url: "/product/details?id=2",
  },
  {
    id: 3,
    title: "Minimalist Scandinavian Sofa",
    image: "/home/special3.png",
    timeAgo: "6 Minutes Ago",
    url: "/product/details?id=3",
  },
  {
    id: 4,
    title: "Luxury Dining Table & Chairs",
    image: "/home/special4.png",
    timeAgo: "12 Minutes Ago",
    url: "/product/details?id=4",
  },
  {
    id: 5,
    title: "Ergonomic Velvet Accent Chair",
    image: "/home/special5.png",
    timeAgo: "18 Minutes Ago",
    url: "/product/details?id=5",
  },
  {
    id: 6,
    title: "Artisanal Ceramic Lamp",
    image: "/home/special6.png",
    timeAgo: "24 Minutes Ago",
    url: "/product/details?id=6",
  },
  {
    id: 7,
    title: "Contemporary Oak Bookshelf",
    image: "/home/special7.png",
    timeAgo: "30 Minutes Ago",
    url: "/product/details?id=7",
  },
  {
    id: 8,
    title: "Modern Wooden Coffee Table",
    image: "/home/special8.png",
    timeAgo: "45 Minutes Ago",
    url: "/product/details?id=8",
  },
];

interface RecentPurchasePopupProps {
  isWhiteTheme?: boolean;
}

export default function RecentPurchasePopup({ isWhiteTheme = false }: RecentPurchasePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);

  useEffect(() => {
    if (isDismissedByUser) return;

    // Initially show after 3 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Main interval cycle: 30 seconds visible, 30 seconds hidden (cycle = 60s)
    let state = "visible"; // after initial show
    const cycleInterval = setInterval(() => {
      setIsVisible((prev) => {
        if (prev) {
          // It was visible, now hide for 30s
          return false;
        } else {
          // It was hidden, switch to next product and show for 30s
          setCurrentIndex((oldIdx) => (oldIdx + 1) % RECENT_PURCHASES.length);
          return true;
        }
      });
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
    };
  }, [isDismissedByUser]);

  const currentItem = RECENT_PURCHASES[currentIndex];

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  return (
    <div
      className={`fixed bottom-20 lg:bottom-6 left-4 z-[90] transition-all duration-700 ease-out select-none ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`relative shadow-2xl rounded-[3px] p-2.5 sm:p-3 pr-8 flex items-center gap-3.5 max-w-[340px] sm:max-w-[370px] transition-colors group ${
          isWhiteTheme
            ? "bg-[#ffffff] border border-[#e5e5e5] hover:border-[#cca382] shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
            : "bg-[#232323] border border-[#333333] hover:border-[#cca382]"
        }`}
      >
        {/* Close Button at top-right */}
        <button
          onClick={handleClose}
          className={`absolute top-2 right-2 transition-colors p-1 cursor-pointer ${
            isWhiteTheme ? "text-gray-400 hover:text-black" : "text-gray-400 hover:text-white"
          }`}
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Product Image Box (White background with rounded square border matching screenshot) */}
        <Link
          href={currentItem.url}
          className={`relative w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] rounded-[2px] p-1.5 shrink-0 flex items-center justify-center overflow-hidden ${
            isWhiteTheme
              ? "bg-[#f8f8f8] border border-[#eaeaea]"
              : "bg-[#ffffff] border border-[#333333]"
          }`}
        >
          <Image
            src={currentItem.image}
            alt={currentItem.title}
            fill
            sizes="70px"
            className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
          />
        </Link>

        {/* Purchase Info Text */}
        <div className="flex-1 min-w-0 pr-1">
          <span
            className={`block text-[13px] sm:text-[14px] font-semibold truncate leading-snug mb-1 ${
              isWhiteTheme ? "text-[#222222]" : "text-white"
            }`}
          >
            Someone recently purchase this item
          </span>
          <Link
            href={currentItem.url}
            className="block text-[12px] sm:text-[13px] text-[#cca382] font-normal hover:underline truncate mb-0.5"
          >
            {currentItem.title}
          </Link>
          <span
            className={`block text-[11px] sm:text-[12px] font-light ${
              isWhiteTheme ? "text-[#777777]" : "text-[#999999]"
            }`}
          >
            {currentItem.timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
}

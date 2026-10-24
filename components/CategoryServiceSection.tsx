"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CategoryIcon {
  id: number;
  title: string;
  subtitle?: string;
  icon: string;
  href: string;
}

const categoryIcons: CategoryIcon[] = [
  {
    id: 1,
    title: "HOME",
    subtitle: "ACCESSORIES",
    icon: "/home/icon1.png",
    href: "/collections",
  },
  {
    id: 2,
    title: "HOME",
    subtitle: "DECOR",
    icon: "/home/icon2.png",
    href: "/collections",
  },
  {
    id: 3,
    title: "DECORATIONS",
    icon: "/home/icon3.png",
    href: "/collections",
  },
  {
    id: 4,
    title: "BED LINEN",
    icon: "/home/icon4.png",
    href: "/collections",
  },
  {
    id: 5,
    title: "BLANKETS",
    icon: "/home/icon5.png",
    href: "/collections",
  },
  {
    id: 6,
    title: "SOFAS",
    icon: "/home/icon6.png",
    href: "/collections",
  },
];

export default function CategoryServiceSection({
  isWhiteTheme = false,
}: {
  isWhiteTheme?: boolean;
}) {
  return (
    <section
      className={`py-8 sm:py-10 transition-colors duration-300 ${
        isWhiteTheme ? "bg-[#f9f9f9]" : "bg-[#232323]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categoryIcons.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-center gap-3.5 px-3 py-4 rounded-[2px] transition-all duration-300 cursor-pointer group select-none ${
                isWhiteTheme
                  ? "bg-white hover:bg-[#c7a78b] shadow-sm border border-gray-200"
                  : "bg-[#262626] hover:bg-[#c7a78b] border border-transparent hover:border-[#c7a78b]"
              }`}
            >
              {/* Icon: In light theme it's dark and turns white on hover. In dark theme it's white and turns dark on hover */}
              <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={34}
                  height={34}
                  className={`object-contain transition-all duration-300 ${
                    isWhiteTheme
                      ? "filter brightness-0 group-hover:invert"
                      : "filter brightness-0 invert group-hover:invert-0"
                  }`}
                />
              </div>

              {/* Text label: Dark in light theme, white in dark theme, turns white on hover (#c7a78b) */}
              <div className="text-left">
                <h4
                  className={`text-[13px] sm:text-[14px] font-black tracking-wider uppercase leading-tight transition-colors group-hover:text-white ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  {item.title}
                </h4>
                {item.subtitle && (
                  <span
                    className={`block text-[13px] sm:text-[14px] font-black tracking-wider uppercase leading-tight transition-colors group-hover:text-white ${
                      isWhiteTheme ? "text-[#222222]" : "text-white"
                    }`}
                  >
                    {item.subtitle}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

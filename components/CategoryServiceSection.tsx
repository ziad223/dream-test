"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

interface CategoryIcon {
  id: number;
  title: string;
  subtitle?: string;
  icon: string;
  href: string;
}

const baseCategoryIcons: CategoryIcon[] = [
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

// Duplicate items so that loop has plenty of items on all screen sizes to scroll smoothly forever
const categoryIcons: CategoryIcon[] = [
  ...baseCategoryIcons.map((item) => ({ ...item, id: item.id })),
  ...baseCategoryIcons.map((item) => ({ ...item, id: item.id + 10 })),
];

export default function CategoryServiceSection({
  isWhiteTheme = false,
}: {
  isWhiteTheme?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<CategoryIcon[]>(categoryIcons);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    async function loadCategories() {
      try {
        const { etrolleyApi } = await import("@/lib/api");
        const homeRes = await etrolleyApi.getStoreHome();
        const sections = homeRes?.data?.sections || [];
        const catSection = sections.find((s: any) => s.key === "categories");
        const cats = catSection?.data || [];

        if (isMounted && cats.length > 0) {
          const mapped: CategoryIcon[] = cats.map((c: any, idx: number) => ({
            id: c.id || idx + 1,
            title: typeof c.name === "string" ? c.name : (c.name?.en || c.name?.ar || "Category"),
            icon: c.icon || baseCategoryIcons[idx % baseCategoryIcons.length].icon,
            href: `/collections?category=${c.slug || c.id}`,
          }));
          // Duplicate for infinite smooth marquee/slider loop
          setItems([...mapped, ...mapped.map((m) => ({ ...m, id: m.id + 1000 }))]);
        }
      } catch (err) {
        console.warn("Using fallback categories:", err);
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderCard = (item: CategoryIcon) => (
    <Link
      href={item.href}
      className={`flex items-center justify-center gap-3.5 px-3 py-4 rounded-[2px] transition-all duration-300 cursor-pointer group select-none h-full min-h-[72px] ${
        isWhiteTheme
          ? "bg-white hover:bg-[#c7a78b] shadow-sm border border-gray-200"
          : "bg-[#262626] hover:bg-[#c7a78b] border border-transparent hover:border-[#c7a78b]"
      }`}
    >
      {/* Icon */}
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

      {/* Text label */}
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
  );

  return (
    <section
      className={`py-8 sm:py-10 transition-colors duration-300 ${
        isWhiteTheme ? "bg-[#f9f9f9]" : "bg-[#232323]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {mounted ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            loop={true}
            speed={800}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 14,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 16,
              },
            }}
            className="w-full"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                {renderCard(item)}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {items.slice(0, 6).map((item) => (
              <div key={item.id}>{renderCard(item)}</div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

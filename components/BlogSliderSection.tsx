"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

interface BlogPost {
  id: number;
  date: string;
  title: string;
  author: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    date: "07 May 2025 07:15:AM",
    title: "Elevate Your Space: The Art Of Stylish Furnishing!",
    author: "admin",
    image: "/home/slider3.png",
    slug: "elevate-your-space",
  },
  {
    id: 2,
    date: "07 May 2025 07:17:AM",
    title: "Small Space, Big Style: Furnishing Ideas For Compact Living",
    author: "admin",
    image: "/home/slider2.png",
    slug: "small-space-big-style",
  },
  {
    id: 3,
    date: "07 May 2025 07:13:AM",
    title: "Artistry In Every Corner: Mastering The Symphony Of Furnishing",
    author: "admin",
    image: "/home/slider1.png",
    slug: "artistry-in-every-corner",
  },
  {
    id: 4,
    date: "08 May 2025 09:30:AM",
    title: "Timeless Elegance: Choosing The Perfect Living Room Centerpiece",
    author: "admin",
    image: "/home/slider3.png",
    slug: "timeless-elegance",
  },
  {
    id: 5,
    date: "09 May 2025 10:45:AM",
    title: "Modern Minimalism: Harmonizing Wood & Metal In Home Decor",
    author: "admin",
    image: "/home/slider2.png",
    slug: "modern-minimalism",
  },
  {
    id: 6,
    date: "10 May 2025 11:20:AM",
    title: "Crafting Comfort: The Ultimate Guide To Ergonomic Armchairs",
    author: "admin",
    image: "/home/slider1.png",
    slug: "crafting-comfort",
  },
];

interface BlogSliderSectionProps {
  isWhiteTheme?: boolean;
}

export default function BlogSliderSection({
  isWhiteTheme = false,
}: BlogSliderSectionProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <section
      className={`py-14 sm:py-20 transition-colors duration-300 relative select-none ${
        isWhiteTheme ? "bg-white text-gray-900" : "bg-[#232323] text-white"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section Matching Screenshot 100% */}
        <div className="text-center mb-10 sm:mb-14">
          <p
            className={`text-[15px] sm:text-[16px] font-normal tracking-wide mb-1 ${
              isWhiteTheme ? "text-[#777777]" : "text-[#b0b0b0]"
            }`}
          >
            Recent Story
          </p>
          <h2
            className={`text-2xl sm:text-3xl md:text-[34px] font-bold tracking-[0.14em] uppercase font-sans leading-tight ${
              isWhiteTheme ? "text-[#222222]" : "text-white"
            }`}
          >
            FROM THE BLOG
          </h2>
          {/* Elegant decorative line under title */}
          <div className="w-14 h-[3px] bg-[#cca382] mx-auto mt-3 sm:mt-4" />
        </div>

        {/* Swiper Slider without arrows or dots - Clean matching screenshot 100% */}
        <div className="relative">
          {mounted ? (
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              speed={800}
              spaceBetween={28}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              className="w-full"
            >
              {blogPosts.map((post) => (
                <SwiperSlide key={post.id}>
                  <article className="group flex flex-col cursor-pointer pb-2">
                    {/* Blog Image with Zoom Effect */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181615] rounded-[2px]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Blog Details below image - clean and stable, no text color changes */}
                    <div className="pt-5 flex flex-col text-left">
                      {/* Date */}
                      <span
                        className={`text-[13px] font-normal tracking-wide mb-1.5 ${
                          isWhiteTheme ? "text-[#777777]" : "text-[#999999]"
                        }`}
                      >
                        {post.date}
                      </span>

                      {/* Title */}
                      <h3
                        className={`text-[16px] sm:text-[17px] font-bold leading-snug line-clamp-2 ${
                          isWhiteTheme ? "text-[#222222]" : "text-white"
                        }`}
                      >
                        {post.title}
                      </h3>

                      {/* Fixed Underline below title */}
                      <div className="w-8 h-[2px] bg-[#cca382] my-3" />

                      {/* Author */}
                      <p
                        className={`text-[13px] font-normal ${
                          isWhiteTheme ? "text-[#666666]" : "text-[#888888]"
                        }`}
                      >
                        By: <span className="capitalize">{post.author}</span>
                      </p>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {blogPosts.slice(0, 3).map((post) => (
                <article key={post.id} className="group flex flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181615] rounded-[2px]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-5 flex flex-col text-left">
                    <span className="text-[13px] font-normal text-[#999999] mb-1.5">
                      {post.date}
                    </span>
                    <h3 className="text-[16px] sm:text-[17px] font-bold leading-snug text-white">
                      {post.title}
                    </h3>
                    <div className="w-8 h-[2px] bg-[#cca382] my-3" />
                    <p className="text-[13px] font-normal text-[#888888]">
                      By: <span className="capitalize">{post.author}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

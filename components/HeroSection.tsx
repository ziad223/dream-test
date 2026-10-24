"use client";

import React from "react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#0f0f0f] overflow-hidden select-none">
      {/* 
        Hero Banner using Next.js Image component with fill & responsive object-fit
        to ensure the entire banner (lamp, chair, text) displays in complete crisp fidelity 
        without being cropped or distorted on any device.
      */}
      <div className="relative w-full h-[280px] xs:h-[340px] sm:h-[440px] md:h-[560px] lg:h-[680px] xl:h-[760px]">
        <Image
          src="/home/hero.png"
          alt="Greatest Chair Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_top] md:object-center"
        />
      </div>
    </section>
  );
}

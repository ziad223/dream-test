"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface CustomizeButtonProps {
  onClick: () => void;
}

export default function CustomizeButton({ onClick }: CustomizeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#2d2926] hover:bg-[#3d3834] text-white border-l border-y border-[#4a423d] shadow-2xl py-3 px-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group rounded-l-md"
      style={{
        writingMode: "vertical-rl",
        textOrientation: "mixed",
      }}
      title="Open Theme Settings"
    >
      <div className="flex items-center space-x-1.5 transform rotate-180">
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4996a] mb-1.5 transition-transform group-hover:rotate-90" />
        <span className="text-[11px] font-bold tracking-[0.2em] text-[#cccccc] group-hover:text-white uppercase">
          CUSTOMIZE
        </span>
      </div>
    </button>
  );
}

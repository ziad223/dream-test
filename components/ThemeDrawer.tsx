"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Check, ExternalLink } from "lucide-react";

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rtlMode: boolean;
  setRtlMode: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function ThemeDrawer({
  isOpen,
  onClose,
  rtlMode,
  setRtlMode,
  darkMode,
  setDarkMode,
}: ThemeDrawerProps) {
  const [demosExpanded, setDemosExpanded] = useState(true);
  const [productBoxExpanded, setProductBoxExpanded] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<"one" | "two">("one");

  // Automatically close Customize / Theme Drawer when screen expands to desktop (large screens >= 1024px)
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  const demos = [
    { name: "Fashion", image: "/home/fashion-1.png", tag: "Fashion 1" },
    { name: "Fashion 2", image: "/home/fashion-2.png", tag: "Fashion 2" },
    { name: "Fashion 3", image: "/home/fashion-3.png", tag: "Fashion 3" },
    { name: "Fashion 4", image: "/home/fashion-4.png", tag: "Fashion 4" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden flex justify-end" dir={rtlMode ? "rtl" : "ltr"}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Container - styled conditionally for Dark Mode vs Light Mode */}
      <div
        className={`relative w-full max-w-[340px] sm:max-w-[380px] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 select-none ${
          darkMode ? "bg-[#202020] text-[#f0f0f0]" : "bg-white text-[#333333]"
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            darkMode ? "border-[#2d2d2d]" : "border-[#eeeeee]"
          }`}
        >
          <h2 className={`text-[17px] font-semibold ${darkMode ? "text-white" : "text-[#222222]"}`}>
            Theme Setting
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              darkMode ? "hover:bg-[#303030] text-gray-300 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-black"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Section 1: 50+ Demo */}
          <div className={`border-b pb-6 ${darkMode ? "border-[#2d2d2d]" : "border-[#f0f0f0]"}`}>
            <button
              onClick={() => setDemosExpanded(!demosExpanded)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <div>
                <h3 className={`text-[15px] font-semibold ${darkMode ? "text-white" : "text-[#222222]"}`}>
                  50+ Demo
                </h3>
                <p className="text-xs text-[#888888] mt-0.5">Explore 50+ demos</p>
              </div>
              {demosExpanded ? (
                <ChevronUp className={`w-4 h-4 ${darkMode ? "text-gray-400 group-hover:text-white" : "text-gray-400 group-hover:text-black"}`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${darkMode ? "text-gray-400 group-hover:text-white" : "text-gray-400 group-hover:text-black"}`} />
              )}
            </button>

            {demosExpanded && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {demos.map((d, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div
                      className={`relative aspect-[4/3] rounded-sm overflow-hidden border transition-all duration-200 group-hover:border-[#d4996a] group-hover:shadow-md ${
                        darkMode ? "border-[#333333] bg-[#181818]" : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span
                      className={`block text-center text-xs font-medium mt-1.5 transition-colors ${
                        darkMode ? "text-gray-300 group-hover:text-[#d4996a]" : "text-gray-700 group-hover:text-[#d4996a]"
                      }`}
                    >
                      {d.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: 10+ Product Box */}
          <div className={`border-b pb-6 ${darkMode ? "border-[#2d2d2d]" : "border-[#f0f0f0]"}`}>
            <button
              onClick={() => setProductBoxExpanded(!productBoxExpanded)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <div>
                <h3 className={`text-[15px] font-semibold ${darkMode ? "text-white" : "text-[#222222]"}`}>
                  10+ Product Box
                </h3>
                <p className="text-xs text-[#888888] mt-0.5">
                  Discover more product variations
                </p>
              </div>
              {productBoxExpanded ? (
                <ChevronUp className={`w-4 h-4 ${darkMode ? "text-gray-400 group-hover:text-white" : "text-gray-400 group-hover:text-black"}`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${darkMode ? "text-gray-400 group-hover:text-white" : "text-gray-400 group-hover:text-black"}`} />
              )}
            </button>

            {productBoxExpanded && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Style One */}
                <div
                  onClick={() => setSelectedStyle("one")}
                  className="cursor-pointer group text-center"
                >
                  <div
                    className={`p-3 rounded border text-left transition-all ${
                      selectedStyle === "one"
                        ? "border-[#d4996a] shadow-sm ring-1 ring-[#d4996a]"
                        : darkMode ? "border-[#333333] hover:border-gray-500" : "border-gray-200 hover:border-gray-300"
                    } ${darkMode ? "bg-[#1c1c1c]" : "bg-[#f9f9f9]"}`}
                  >
                    <div className={`w-full aspect-[3/4] rounded flex items-center justify-center mb-2 ${darkMode ? "bg-[#252525] text-gray-500" : "bg-gray-100 text-gray-300"}`}>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div className="text-[10px] text-gray-400">★ 0</div>
                    <div className={`text-xs font-semibold truncate ${darkMode ? "text-white" : "text-gray-800"}`}>Brand Name</div>
                    <div className="text-[10px] text-gray-500">Product title</div>
                    <div className={`text-xs font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>$9.72</div>
                  </div>
                  <span className={`block text-xs font-medium mt-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Style One
                  </span>
                </div>

                {/* Style Two */}
                <div
                  onClick={() => setSelectedStyle("two")}
                  className="cursor-pointer group text-center"
                >
                  <div
                    className={`p-3 rounded border text-left transition-all ${
                      selectedStyle === "two"
                        ? "border-[#d4996a] shadow-sm ring-1 ring-[#d4996a]"
                        : darkMode ? "border-[#333333] hover:border-gray-500" : "border-gray-200 hover:border-gray-300"
                    } ${darkMode ? "bg-[#1c1c1c]" : "bg-white"}`}
                  >
                    <div className={`w-full aspect-[3/4] rounded flex items-center justify-center mb-2 relative ${darkMode ? "bg-[#252525] text-gray-500" : "bg-gray-100 text-gray-300"}`}>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
                      </svg>
                      <div className="absolute top-1 right-1 w-3 h-3 rounded-full border border-gray-400" />
                    </div>
                    <div className="text-[10px] text-gray-400">★ 0</div>
                    <div className={`text-xs font-semibold truncate ${darkMode ? "text-white" : "text-gray-800"}`}>Brand Name</div>
                    <div className="text-[10px] text-gray-500">Product title</div>
                    <div className="text-xs font-bold text-[#d4996a]">$9.72</div>
                  </div>
                  <span className={`block text-xs font-medium mt-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Style Two
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: RTL Mode */}
          <div className={`flex items-center justify-between border-b pb-6 ${darkMode ? "border-[#2d2d2d]" : "border-[#f0f0f0]"}`}>
            <div>
              <h3 className={`text-[15px] font-semibold ${darkMode ? "text-white" : "text-[#222222]"}`}>
                RTL Mode
              </h3>
              <p className="text-xs text-[#888888] mt-0.5">
                Change Language Direction
              </p>
            </div>
            {/* Toggle switch with fixed ltr orientation so knob stays inside track */}
            <div dir="ltr" className="shrink-0">
              <button
                type="button"
                onClick={() => setRtlMode(!rtlMode)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer block p-0.5 ${
                  rtlMode ? "bg-[#d4996a]" : darkMode ? "bg-[#3a3a3a]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    rtlMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 4: Dark Mode */}
          <div className={`flex items-center justify-between border-b pb-6 ${darkMode ? "border-[#2d2d2d]" : "border-[#f0f0f0]"}`}>
            <div>
              <h3 className={`text-[15px] font-semibold ${darkMode ? "text-white" : "text-[#222222]"}`}>
                Dark Mode
              </h3>
              <p className="text-xs text-[#888888] mt-0.5">
                Switch Between Light And Dark Mode
              </p>
            </div>
            {/* Toggle switch with fixed ltr orientation so knob stays inside track */}
            <div dir="ltr" className="shrink-0">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer block p-0.5 ${
                  darkMode ? "bg-[#d4996a]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 5: Admin */}
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className={`text-[15px] font-semibold ${darkMode ? "text-white" : "text-[#222222]"}`}>Admin</h3>
              <p className="text-xs text-[#888888] mt-0.5">Backend Admin Panel</p>
            </div>
         
          </div>
        </div>
      </div>
    </div>
  );
}

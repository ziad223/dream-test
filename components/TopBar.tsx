"use client";

import React, { useState } from "react";
import { Phone, ChevronDown } from "lucide-react";

export default function TopBar() {
  const [currency, setCurrency] = useState("USD");
  const [lang, setLang] = useState("ENGLISH");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // SVG Flag Components
  const UsFlag = () => (
    <svg className="w-[16px] h-[12px] sm:w-[18px] sm:h-[13px] rounded-[1px] object-cover shadow-xs shrink-0" viewBox="0 0 640 480">
      <g fillRule="evenodd">
        <path fill="#bd3d44" d="M0 0h640v480H0z"/>
        <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"/>
        <path fill="#192f5d" d="M0 0h256v258.5H0z"/>
        <circle cx="128" cy="129.2" r="60" fill="#fff" opacity="0.3"/>
      </g>
    </svg>
  );

  const FrFlag = () => (
    <svg className="w-[16px] h-[12px] sm:w-[18px] sm:h-[13px] rounded-[1px] object-cover shadow-xs shrink-0" viewBox="0 0 640 480">
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#00267f" d="M0 0h213.3v480H0z"/>
        <path fill="#fff" d="M213.3 0h213.4v480H213.3z"/>
        <path fill="#f31830" d="M426.7 0H640v480H426.7z"/>
      </g>
    </svg>
  );

  const languages = [
    { code: "en", name: "English", display: "ENGLISH", flag: <UsFlag /> },
    { code: "fr", name: "Français", display: "FRANÇAIS", flag: <FrFlag /> },
  ];

  const currencies = ["USD", "INR", "GBP", "EUR"];

  return (
    <div className="w-full bg-[#0f0f0f] border-b border-[#222222] text-[13px] sm:text-[14px] text-[#CFD4DA] select-none font-sans relative z-[70]">
      <div className="w-full px-3 sm:px-8 xl:px-14 h-10 sm:h-11 flex items-center justify-between gap-2 relative">
        {/* Left Side: Welcome message & Phone - truncated gracefully on mobile so it doesn't wrap or break */}
        <div className="flex items-center space-x-6 text-[#CFD4DA] text-[12px] sm:text-[14px] font-normal min-w-0">
          <span className="truncate">Welcome to Our store Multikart</span>
          <div className="hidden md:flex items-center space-x-1.5 text-[#CFD4DA] shrink-0">
            <Phone className="w-3.5 h-3.5 text-[#d4996a]" />
            <span>
              Call Us: <span className="text-[#CFD4DA]">123 - 456 - 7890</span>
            </span>
          </div>
        </div>

        {/* Right Side: Language & Currency - strictly shrink-0 to prevent overlapping */}
        <div className="flex items-center space-x-3 sm:space-x-4 text-[#FFFFFF] text-[12px] sm:text-[14px] font-medium shrink-0">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowCurrencyDropdown(false);
              }}
              className="flex items-center space-x-1.5 sm:space-x-2 text-[#FFFFFF] hover:text-[#d4996a] transition-colors cursor-pointer py-1 text-[12px] sm:text-[14px] font-medium"
            >
              {lang === "FRANÇAIS" || lang === "Français" ? <FrFlag /> : <UsFlag />}
              <span className="text-[#FFFFFF] uppercase tracking-wide">{lang}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFFFFF]" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-[#262626] border border-[#3b3b3b] shadow-2xl py-1 z-[100] rounded-[2px] animate-in fade-in duration-150">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLang(item.display);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3.5 py-2 text-[13px] sm:text-[14px] font-normal text-left transition-colors ${
                      lang === item.display || lang === item.name
                        ? "bg-[#cca382] text-white font-medium"
                        : "text-[#ffffff] hover:bg-[#333333] hover:text-[#d4996a]"
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-[1px] h-3.5 sm:h-4 bg-[#3a3532]" />

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCurrencyDropdown(!showCurrencyDropdown);
                setShowLangDropdown(false);
              }}
              className="flex items-center space-x-1 sm:space-x-1.5 text-[#FFFFFF] hover:text-[#d4996a] transition-colors cursor-pointer py-1 text-[12px] sm:text-[14px] font-medium"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFFFFF]" />
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 top-full mt-1 w-24 bg-[#262626] border border-[#3b3b3b] shadow-2xl py-1 z-[100] rounded-[2px] animate-in fade-in duration-150">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-[13px] sm:text-[14px] font-normal transition-colors ${
                      currency === curr
                        ? "bg-[#cca382] text-white font-medium"
                        : "text-[#ffffff] hover:bg-[#333333] hover:text-[#d4996a]"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

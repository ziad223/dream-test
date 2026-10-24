"use client";

import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PromoCards from "@/components/PromoCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryServiceSection from "@/components/CategoryServiceSection";
import FullWidthOfferBanner from "@/components/FullWidthOfferBanner";
import Under200StoreSection from "@/components/Under200StoreSection";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CustomizeButton from "@/components/CustomizeButton";
import ThemeDrawer from "@/components/ThemeDrawer";
import RecentPurchasePopup from "@/components/RecentPurchasePopup";
import { ProductModalProvider } from "@/components/ProductModalContext";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rtlMode, setRtlMode] = useState(false);
  // Default to Dark Mode as the primary theme (dark = true)
  const [darkMode, setDarkMode] = useState(true);

  // Load saved preference if customer explicitly changed it, otherwise keep Dark Mode
  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("multikart_theme_mode");
      if (savedTheme === "light") {
        setDarkMode(false);
      } else if (savedTheme === "dark") {
        setDarkMode(true);
      }
      const savedRtl = localStorage.getItem("multikart_rtl_mode");
      if (savedRtl === "true") {
        setRtlMode(true);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const handleSetDarkMode = (val: boolean) => {
    setDarkMode(val);
    try {
      localStorage.setItem("multikart_theme_mode", val ? "dark" : "light");
    } catch {}
  };

  const handleSetRtlMode = (val: boolean) => {
    setRtlMode(val);
    try {
      localStorage.setItem("multikart_rtl_mode", val ? "true" : "false");
    } catch {}
  };

  return (
    <ProductModalProvider isWhiteTheme={!darkMode}>
      <div
        dir={rtlMode ? "rtl" : "ltr"}
        className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
          darkMode ? "bg-[#181615] text-[#cccccc]" : "bg-[#ffffff] text-[#222222]"
        }`}
      >
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Main Navigation Header */}
      <Header onOpenThemeDrawer={() => setIsDrawerOpen(true)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* 3. Hero Banner with complete background, armchair, lamp, and typography */}
        <HeroSection />

        {/* 4. Three Promo Overlapping Cards (SAVE 30% ACCENT, SAVE 60% STOOL, SAVE 60% LOUNGE) */}
        <PromoCards />

        {/* 5. TOP COLLECTION Products Showcase */}
        <FeaturedProducts isWhiteTheme={!darkMode} />

        {/* 6. 6-Column Category Services (icon1.png to icon6.png) */}
        <CategoryServiceSection isWhiteTheme={!darkMode} />

        {/* 7. Full-Width 3-Column Offer Banner (banner1.png, center content, banner2.png) */}
        <FullWidthOfferBanner isWhiteTheme={!darkMode} />

        {/* 8. UNDER $200 STORE with Left Big Banner & 8 Special Products */}
        <Under200StoreSection isWhiteTheme={!darkMode} />
      </main>

      {/* 6. Footer Section */}
      <Footer isWhiteTheme={!darkMode} />

      {/* 7. Sticky Bottom Nav Bar for Mobile Screens */}
      <MobileBottomNav />

      {/* 8. Floating Customize Trigger Button on Right Border */}
      <CustomizeButton onClick={() => setIsDrawerOpen(true)} />

      {/* 9. Live Recent Purchase Toast (shows 30s, hides 30s, slides from bottom left) */}
      <RecentPurchasePopup isWhiteTheme={!darkMode} />

      {/* 10. Theme Setting Slide-in Panel */}
      <ThemeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        rtlMode={rtlMode}
        setRtlMode={handleSetRtlMode}
        darkMode={darkMode}
        setDarkMode={handleSetDarkMode}
      />
    </div>
  </ProductModalProvider>
  );
}

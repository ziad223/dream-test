"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { useProductModal } from "./ProductModalContext";

export default function Footer({ isWhiteTheme = false }: { isWhiteTheme?: boolean }) {
  const { storeInfo } = useProductModal();
  // Mobile accordion active keys
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionName: string) => {
    setOpenSection((prev) => (prev === sectionName ? null : sectionName));
  };

  return (
    <footer
      className={`border-t text-xs pt-10 sm:pt-16 pb-20 md:pb-8 transition-colors duration-300 font-sans ${
        isWhiteTheme
          ? "bg-[#f8f8f8] text-[#555555] border-[#e8e8e8]"
          : "bg-[#212121] text-[#9e9e9e] border-[#2e2e2e]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            1. TOP NEWSLETTER ROW (KNOW IT ALL FIRST!)
            ======================================================== */}
        <div
          className={`border-b pb-8 sm:pb-12 mb-8 sm:mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
            isWhiteTheme ? "border-gray-200" : "border-[#2c2c2c]"
          }`}
        >
          {/* Left Text */}
          <div className="text-left">
            <h3
              className={`text-[17px] sm:text-[18px] font-bold tracking-[0.08em] uppercase ${
                isWhiteTheme ? "text-gray-900" : "text-white"
              }`}
            >
              KNOW IT ALL FIRST!
            </h3>
            <p className="text-[#888888] text-[13px] sm:text-[14px] mt-1 font-normal">
              Never Miss Anything From Store By Signing Up To Our Newsletter.
            </p>
          </div>

          {/* Right Input & Subscribe Button */}
          <div className="w-full md:w-auto flex items-center justify-end">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full sm:w-[480px] h-[48px] border border-[#333333] rounded-[1px] overflow-hidden bg-[#2b2b2b]"
            >
              <input
                type="email"
                placeholder="Enter Email Address"
                className="flex-1 px-4 text-[13px] bg-transparent text-white placeholder:text-[#777777] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#c7a78b] hover:bg-[#b89577] text-white font-bold text-[12px] sm:text-[13px] px-6 sm:px-7 uppercase tracking-[0.15em] shrink-0 transition-colors cursor-pointer flex items-center justify-center"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* ========================================================
            2. MAIN FOOTER CONTENT:
               - Desktop: 5 clean columns
               - Mobile: Brand box + Accordion for the 4 sections
            ======================================================== */}

        {/* --- BRAND INFO (Visible on both Mobile & Desktop) --- */}
        <div className="lg:hidden space-y-4 pb-6 select-none">
          <Link href="/" className="inline-block">
            <div className="relative h-7 w-36">
              <Image
                src={storeInfo?.images?.footer_logo || storeInfo?.images?.logo || "/home/logo.png"}
                alt={storeInfo?.name || "Multikart"}
                fill
                sizes="144px"
                className="object-contain object-left"
              />
            </div>
          </Link>
          <p className="text-[13.5px] leading-relaxed text-[#999999] max-w-sm">
            {storeInfo?.seo?.description?.ar || "Discover the latest trends and enjoy seamless shopping with our exclusive collections."}
          </p>
          <div className="flex items-center space-x-6 pt-1 text-white">
            <a href="#" className="hover:text-[#c7a78b] transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#c7a78b] transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#c7a78b] transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#c7a78b] transition-colors" aria-label="Pinterest">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.155-1.498-.698-2.435-2.889-2.435-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* --- MOBILE ACCORDION (Visible ONLY on mobile screens < lg) --- */}
        <div className="lg:hidden divide-y divide-[#2e2e2e] border-y border-[#2e2e2e] mb-8">
          {/* 1. CATEGORIES Accordion */}
          <div>
            <button
              onClick={() => toggleSection("categories")}
              className="w-full py-4 flex items-center justify-between text-left text-white text-[15px] font-bold uppercase tracking-wide cursor-pointer"
            >
              <span>CATEGORIES</span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform duration-200 ${
                  openSection === "categories" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "categories" && (
              <ul className="pb-4 space-y-2.5 text-[13px] text-[#888888] animate-in fade-in duration-150">
                <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Baby Essentials</Link></li>
                <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Bag Emporium</Link></li>
                <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Books</Link></li>
                <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Christmas</Link></li>
                <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Classic Furnishings</Link></li>
                <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Crystal Clarity Optics</Link></li>
              </ul>
            )}
          </div>

          {/* 2. USEFUL LINKS Accordion */}
          <div>
            <button
              onClick={() => toggleSection("useful_links")}
              className="w-full py-4 flex items-center justify-between text-left text-white text-[15px] font-bold uppercase tracking-wide cursor-pointer"
            >
              <span>USEFUL LINKS</span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform duration-200 ${
                  openSection === "useful_links" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "useful_links" && (
              <ul className="pb-4 space-y-2.5 text-[13px] text-[#888888] animate-in fade-in duration-150">
                <li><Link href="/" className="hover:text-[#c7a78b] transition-colors block">Home</Link></li>
                <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Collections</Link></li>
                <li><Link href="/about-us" className="hover:text-[#c7a78b] transition-colors block">About Us</Link></li>
                <li><Link href="/blogs" className="hover:text-[#c7a78b] transition-colors block">Blogs</Link></li>
                <li><Link href="/offers" className="hover:text-[#c7a78b] transition-colors block">Offers</Link></li>
                <li><Link href="/search" className="hover:text-[#c7a78b] transition-colors block">Search</Link></li>
              </ul>
            )}
          </div>

          {/* 3. HELP CENTER Accordion */}
          <div>
            <button
              onClick={() => toggleSection("help_center")}
              className="w-full py-4 flex items-center justify-between text-left text-white text-[15px] font-bold uppercase tracking-wide cursor-pointer"
            >
              <span>HELP CENTER</span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform duration-200 ${
                  openSection === "help_center" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "help_center" && (
              <ul className="pb-4 space-y-2.5 text-[13px] text-[#888888] animate-in fade-in duration-150">
                <li><Link href="/account/dashboard" className="hover:text-[#c7a78b] transition-colors block">My Account</Link></li>
                <li><Link href="/account/orders" className="hover:text-[#c7a78b] transition-colors block">My Orders</Link></li>
                <li><Link href="/wishlist" className="hover:text-[#c7a78b] transition-colors block">Wishlist</Link></li>
                <li><Link href="/faq" className="hover:text-[#c7a78b] transition-colors block">Faq&apos;s</Link></li>
                <li><Link href="/contact-us" className="hover:text-[#c7a78b] transition-colors block">Contact Us</Link></li>
              </ul>
            )}
          </div>

          {/* 4. STORE INFORMATION Accordion */}
          <div>
            <button
              onClick={() => toggleSection("store_info")}
              className="w-full py-4 flex items-center justify-between text-left text-white text-[15px] font-bold uppercase tracking-wide cursor-pointer"
            >
              <span>STORE INFORMATION</span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform duration-200 ${
                  openSection === "store_info" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "store_info" && (
              <ul className="pb-4 space-y-3 text-[13px] text-[#888888] animate-in fade-in duration-150">
                <li className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-[#888888] shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Multikart Demo Store, Demo Store India 345-659
                  </span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-[#888888] shrink-0" />
                  <span>Call Us: 123-456-7898</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-[#888888] shrink-0" />
                  <span className="truncate">Email Us: Support@Multikart.Com</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* --- DESKTOP 5-COLUMN VIEW (Visible ONLY on lg+) --- */}
        <div className="hidden lg:grid grid-cols-5 gap-8 pb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 pr-2">
            <Link href="/" className="inline-block">
              <div className="relative h-7 w-36">
                <Image
                  src={storeInfo?.images?.footer_logo || storeInfo?.images?.logo || "/home/logo.png"}
                  alt={storeInfo?.name || "Multikart"}
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-[13px] leading-relaxed text-[#888888]">
              {storeInfo?.seo?.description?.ar || "Discover the latest trends and enjoy seamless shopping with our exclusive collections."}
            </p>
            <div className="flex items-center space-x-5 pt-3 text-white">
              <a href="#" className="hover:text-[#c7a78b] transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#c7a78b] transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#c7a78b] transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#c7a78b] transition-colors" aria-label="Pinterest">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.155-1.498-.698-2.435-2.889-2.435-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: CATEGORIES */}
        <div className="hidden lg:block space-y-3">
          <h4
            className={`text-[15px] font-bold uppercase tracking-[0.06em] ${
              isWhiteTheme ? "text-gray-900" : "text-white"
            }`}
          >
            CATEGORIES
          </h4>
          <ul className="space-y-2.5 text-[13px] text-[#888888]">
            <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Baby Essentials</Link></li>
            <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Bag Emporium</Link></li>
            <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Books</Link></li>
            <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Christmas</Link></li>
            <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Classic Furnishings</Link></li>
            <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Crystal Clarity Optics</Link></li>
          </ul>
        </div>

        {/* Col 3: USEFUL LINKS */}
        <div className="hidden lg:block space-y-3">
          <h4
            className={`text-[15px] font-bold uppercase tracking-[0.06em] ${
              isWhiteTheme ? "text-gray-900" : "text-white"
            }`}
          >
            USEFUL LINKS
          </h4>
          <ul className="space-y-2.5 text-[13px] text-[#888888]">
            <li><Link href="/" className="hover:text-[#c7a78b] transition-colors block">Home</Link></li>
            <li><Link href="/collections" className="hover:text-[#c7a78b] transition-colors block">Collections</Link></li>
            <li><Link href="/about-us" className="hover:text-[#c7a78b] transition-colors block">About Us</Link></li>
            <li><Link href="/blogs" className="hover:text-[#c7a78b] transition-colors block">Blogs</Link></li>
            <li><Link href="/offers" className="hover:text-[#c7a78b] transition-colors block">Offers</Link></li>
            <li><Link href="/search" className="hover:text-[#c7a78b] transition-colors block">Search</Link></li>
          </ul>
        </div>

        {/* Col 4: HELP CENTER */}
        <div className="hidden lg:block space-y-3">
          <h4
            className={`text-[15px] font-bold uppercase tracking-[0.06em] ${
              isWhiteTheme ? "text-gray-900" : "text-white"
            }`}
          >
            HELP CENTER
          </h4>
          <ul className="space-y-2.5 text-[13px] text-[#888888]">
            <li><Link href="/account/dashboard" className="hover:text-[#c7a78b] transition-colors block">My Account</Link></li>
            <li><Link href="/account/orders" className="hover:text-[#c7a78b] transition-colors block">My Orders</Link></li>
            <li><Link href="/wishlist" className="hover:text-[#c7a78b] transition-colors block">Wishlist</Link></li>
            <li><Link href="/faq" className="hover:text-[#c7a78b] transition-colors block">Faq&apos;s</Link></li>
            <li><Link href="/contact-us" className="hover:text-[#c7a78b] transition-colors block">Contact Us</Link></li>
          </ul>
        </div>

        {/* Col 5: STORE INFORMATION */}
        <div className="hidden lg:block space-y-3">
          <h4
            className={`text-[15px] font-bold uppercase tracking-[0.06em] ${
              isWhiteTheme ? "text-gray-900" : "text-white"
            }`}
          >
            STORE INFORMATION
          </h4>
          <ul className="space-y-3 text-[13px] text-[#888888]">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-[#888888] shrink-0 mt-0.5" />
              <span className="leading-snug">
                Multikart Demo Store, Demo Store India 345-659
              </span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-[#888888] shrink-0" />
              <span>Call Us: 123-456-7898</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-[#888888] shrink-0" />
              <span className="truncate">Email Us: Support@Multikart.Com</span>
            </li>
          </ul>
        </div>
        </div>

        {/* ========================================================
            3. BOTTOM COPYRIGHT & PAYMENTS ROW (payments.png)
            ======================================================== */}
        <div
          className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-[13px] text-[#888888] gap-4 ${
            isWhiteTheme ? "border-gray-200" : "border-[#2c2c2c]"
          }`}
        >
          <p>© 2026 Multikart Theme by Pixelstrap. Recreated with perfection.</p>

          {/* payments.png image */}
          <div className="relative h-8 w-[240px] sm:w-[270px]">
            <Image
              src="/home/payments.png"
              alt="Accepted Payment Methods"
              fill
              className="object-contain object-center sm:object-right"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

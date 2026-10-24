"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
  Star,
} from "lucide-react";

import { useProductModal } from "./ProductModalContext";

interface HeaderProps {
  onOpenThemeDrawer?: () => void;
  cartCount?: number;
  wishlistCount?: number;
}

export default function Header({
  onOpenThemeDrawer,
}: HeaderProps) {
  const {
    setIsCartOpen,
    setIsSearchOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    cartCount,
    wishlistCount,
  } = useProductModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 44) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMobileSubmenu = (menuName: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === menuName ? null : menuName);
  };

  return (
    <>
      <header
        className={`w-full z-40 sticky top-0 select-none font-sans transition-all duration-300 ${
          isScrolled
            ? "bg-[#0f0f0f] shadow-xl border-b border-[#262626]"
            : "bg-[#0f0f0f] border-b border-[#222222]"
        }`}
      >
        <div className="w-full px-3 sm:px-8 xl:px-14 h-[60px] sm:h-[72px] lg:h-[84px] flex items-center justify-between transition-all duration-300">
          {/* Left Side: Mobile Hamburger Button + Brand Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile Menu Toggle: 3 horizontal bars */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1 text-[#c7a78b] hover:text-white transition-colors cursor-pointer flex flex-col justify-center space-y-1.5 w-7 h-7"
              aria-label="Open Navigation Menu"
            >
              <span className="w-6 h-[2.5px] bg-[#c7a78b] rounded-full block"></span>
              <span className="w-6 h-[2.5px] bg-[#c7a78b] rounded-full block"></span>
              <span className="w-6 h-[2.5px] bg-[#c7a78b] rounded-full block"></span>
            </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative h-7 w-[120px] sm:h-8 sm:w-[145px]">
              <Image
                src="/home/logo.png"
                alt="Multikart"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>
        </div>

        {/* Right Side Container: Navigation Links & Action Icons */}
        <div className="flex items-center space-x-3 sm:space-x-5 lg:space-x-7">
          {/* Main Navigation Menu - relative container for positioning mega menus from the start of the links */}
          <nav className="hidden lg:flex items-center text-[#ffffff] relative font-medium">
            {/* 1. HOME */}
            <div className="relative py-[15px]">
              <Link
                href="/"
                className="flex items-center text-[16px] text-[#ffffff] font-medium hover:text-[#d4996a] transition-colors py-[15px] pr-[18px] pl-0"
              >
                <span className="mr-[6px]">Home</span>
              </Link>
            </div>

            {/* 2. COLLECTION */}
            <div
              className="py-[15px] group"
              onMouseEnter={() => setActiveMenu("COLLECTION")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href="/collections"
                className={`flex items-center text-[16px] font-medium transition-colors py-[15px] pr-[18px] pl-0 ${
                  activeMenu === "COLLECTION" ? "text-[#d4996a]" : "text-[#ffffff] hover:text-[#d4996a]"
                }`}
              >
                <span className="mr-[6px]">Collection</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "COLLECTION" ? "rotate-180 text-[#d4996a]" : "text-[#aaaaaa]"
                  }`}
                />
              </Link>

              {activeMenu === "COLLECTION" && (
                <div className="absolute left-0 top-full pt-0 w-[840px] z-50 animate-in fade-in duration-150">
                  <div className="bg-[#262626] text-[#ffffff] shadow-2xl p-7 rounded-[3px] border border-[#333333] grid grid-cols-[1fr_1fr_1.85fr] gap-6">
                    {/* Col 1: Collection Layouts */}
                    <div>
                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Collection Layouts
                      </h4>
                      <ul className="space-y-3 text-[14px] text-[#bfb8b2] mt-3 font-normal">
                        <li>
                          <Link href="/collections?layout=collection_left_sidebar" className="flex items-center space-x-2 hover:text-[#d4996a] transition-colors">
                            <span>Collection Left Sidebar</span>
                            <span className="bg-[#cca382] text-white text-[10px] px-1.5 py-0.5 rounded-[2px] font-normal leading-none">
                              Hot
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_right_sidebar" className="hover:text-[#d4996a] transition-colors block">
                            Collection Right Sidebar
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_no_sidebar" className="hover:text-[#d4996a] transition-colors block">
                            Collection No Sidebar
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_2_grid" className="hover:text-[#d4996a] transition-colors block">
                            Collection 2 grid
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_3_grid" className="hover:text-[#d4996a] transition-colors block">
                            Collection 3 Grid
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_4_grid" className="hover:text-[#d4996a] transition-colors block">
                            Collection 4 Grid
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_list_view" className="hover:text-[#d4996a] transition-colors block">
                            Collection list
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Col 2: Collection Layouts */}
                    <div>
                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Collection Layouts
                      </h4>
                      <ul className="space-y-3 text-[14px] text-[#bfb8b2] mt-3 font-normal">
                        <li>
                          <Link href="/collections?layout=collection_category_slider" className="hover:text-[#d4996a] transition-colors block">
                            Collection Category Slider
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_category_sidebar" className="hover:text-[#d4996a] transition-colors block">
                            Collection Category Sidebar
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_top_filter" className="hover:text-[#d4996a] transition-colors block">
                            Collection Top Filter
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_sidebar_popup" className="hover:text-[#d4996a] transition-colors block">
                            Collection Sidebar Popup
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections?layout=collection_product_infinite_scroll" className="hover:text-[#d4996a] transition-colors block">
                            Infinite Scroll
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Col 3: Two Product Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Product 1: Gym Coords Set */}
                      <div className="flex flex-col justify-between group/card">
                        <div>
                          <div className="relative w-full h-[225px] bg-[#ffffff] rounded-[2px] overflow-hidden mb-2.5">
                            <span className="absolute top-2 left-2 bg-[#cca382] text-white text-[10px] px-1.5 py-0.5 rounded-[2px] font-normal z-10 leading-none">
                              Featured
                            </span>
                            <button className="absolute top-2 right-2 w-7 h-7 bg-[#262626]/80 rounded-full flex items-center justify-center text-white hover:text-[#d4996a] transition-colors z-10">
                              <Heart className="w-3.5 h-3.5" />
                            </button>
                            <Image
                              src="/home/Sport1.jpg"
                              alt="Gym Coords Set (Brown)"
                              fill
                              className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <h5 className="text-[13px] font-medium text-white truncate">
                            Gym Coords Set (Brown)
                          </h5>
                          <div className="flex items-center space-x-0.5 text-[#d4996a] my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-none stroke-current" />
                            ))}
                            <span className="text-[10px] text-[#777777] ml-1">(0)</span>
                          </div>
                          <span className="text-white text-[13px] font-semibold">$15.00</span>
                        </div>
                      </div>

                      {/* Product 2: Mini Dress */}
                      <div className="flex flex-col justify-between group/card">
                        <div>
                          <div className="relative w-full h-[225px] bg-[#ffffff] rounded-[2px] overflow-hidden mb-2.5">
                            <button className="absolute top-2 right-2 w-7 h-7 bg-[#262626]/80 rounded-full flex items-center justify-center text-white hover:text-[#d4996a] transition-colors z-10">
                              <Heart className="w-3.5 h-3.5" />
                            </button>
                            <Image
                              src="/home/Sport2.jpg"
                              alt="Mini Dress (Purple)"
                              fill
                              className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex items-center space-x-1.5 mb-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#8254c4] inline-block"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-[#3e8a47] inline-block"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-[#823636] inline-block"></span>
                          </div>
                          <h5 className="text-[13px] font-medium text-white truncate">
                            Mini Dress (Purple)
                          </h5>
                          <div className="flex items-center space-x-0.5 text-[#d4996a] my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-none stroke-current" />
                            ))}
                            <span className="text-[10px] text-[#777777] ml-1">(0)</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-white text-[13px] font-semibold">$15.20</span>
                            <span className="text-[#777777] text-[11px] line-through">$16.00</span>
                            <span className="text-[#cca382] text-[10px]">5 % Off</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. PRODUCT */}
            <div
              className="py-[15px] group"
              onMouseEnter={() => setActiveMenu("PRODUCT")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href="/product"
                className={`flex items-center text-[16px] font-medium transition-colors py-[15px] pr-[18px] pl-0 ${
                  activeMenu === "PRODUCT" ? "text-[#d4996a]" : "text-[#ffffff] hover:text-[#d4996a]"
                }`}
              >
                <span className="mr-[6px]">Product</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "PRODUCT" ? "rotate-180 text-[#d4996a]" : "text-[#aaaaaa]"
                  }`}
                />
              </Link>

              {activeMenu === "PRODUCT" && (
                <div className="absolute left-0 top-full pt-0 w-[960px] z-50 animate-in fade-in duration-150">
                  <div className="bg-[#262626] text-[#ffffff] shadow-2xl p-7 rounded-[3px] border border-[#333333] grid grid-cols-[1fr_1fr_1.1fr_1.15fr] gap-6">
                    {/* Col 1 */}
                    <div>
                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Product Page
                      </h4>
                      <ul className="space-y-2.5 text-[14px] text-[#bfb8b2] mt-2 mb-6 font-normal">
                        <li><Link href="/product/details?layout=product_thumbnail" className="hover:text-[#d4996a] transition-colors block">Product Thumbnail</Link></li>
                        <li><Link href="/product/details?layout=product_images" className="hover:text-[#d4996a] transition-colors block">Product Images</Link></li>
                        <li><Link href="/product/details?layout=product_slider" className="hover:text-[#d4996a] transition-colors block">Product Slider</Link></li>
                        <li><Link href="/product/details?layout=product_accordion" className="hover:text-[#d4996a] transition-colors block">Product Accordion</Link></li>
                        <li><Link href="/product/details?layout=product_sticky" className="hover:text-[#d4996a] transition-colors block">Product Sticky</Link></li>
                        <li><Link href="/product/details?layout=vertical_tab" className="hover:text-[#d4996a] transition-colors block">Product Vertical Tab</Link></li>
                      </ul>

                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Product Features
                      </h4>
                      <ul className="space-y-2.5 text-[14px] text-[#bfb8b2] mt-2 font-normal">
                        <li><Link href="/product/details?feature=simple" className="hover:text-[#d4996a] transition-colors block">Product Simple</Link></li>
                        <li><Link href="/product/details?feature=classified" className="hover:text-[#d4996a] transition-colors block">Product Classified</Link></li>
                        <li><Link href="/product/details?feature=size_chart" className="hover:text-[#d4996a] transition-colors block">Size Chart</Link></li>
                        <li><Link href="/product/details?feature=delivery_return" className="hover:text-[#d4996a] transition-colors block">Delivery & Return</Link></li>
                        <li><Link href="/product/details?feature=review" className="hover:text-[#d4996a] transition-colors block">Product Review</Link></li>
                        <li><Link href="/product/details?feature=ask_expert" className="hover:text-[#d4996a] transition-colors block">Ask an Expert</Link></li>
                      </ul>
                    </div>

                    {/* Col 2 */}
                    <div>
                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Product Page
                      </h4>
                      <ul className="space-y-2.5 text-[14px] text-[#bfb8b2] mt-2 mb-6 font-normal">
                        <li><Link href="/product/details?layout=product_sidebar_left" className="hover:text-[#d4996a] transition-colors block">Product Sidebar Left</Link></li>
                        <li><Link href="/product/details?layout=product_sidebar_right" className="hover:text-[#d4996a] transition-colors block">Product Sidebar Right</Link></li>
                        <li><Link href="/product/details?layout=product_no_sidebar" className="hover:text-[#d4996a] transition-colors block">Product No Sidebar</Link></li>
                        <li><Link href="/product/details?layout=product_column_thumbnail" className="hover:text-[#d4996a] transition-colors block">Product Column Thumbnail</Link></li>
                        <li><Link href="/product/details?layout=product_thumbnail_image_outside" className="hover:text-[#d4996a] transition-colors block truncate">Product Thumbnail Image ...</Link></li>
                      </ul>

                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Product Features
                      </h4>
                      <ul className="space-y-2.5 text-[14px] text-[#bfb8b2] mt-2 font-normal">
                        <li><Link href="/product/details?feature=cross_sale" className="hover:text-[#d4996a] transition-colors block">Bundle (Cross Sale)</Link></li>
                        <li><Link href="/product/details?feature=hot_stock" className="hover:text-[#d4996a] transition-colors block">Hot Stock Progress</Link></li>
                        <li><Link href="/product/details?feature=out_stock" className="hover:text-[#d4996a] transition-colors block">Out Stock</Link></li>
                        <li><Link href="/product/details?feature=sale_countdown" className="hover:text-[#d4996a] transition-colors block">Sale Countdown</Link></li>
                        <li><Link href="/product/details?feature=product_zoom" className="hover:text-[#d4996a] transition-colors block">Product Zoom</Link></li>
                      </ul>
                    </div>

                    {/* Col 3 */}
                    <div>
                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Product Variants Style
                      </h4>
                      <ul className="space-y-2.5 text-[14px] text-[#bfb8b2] mt-2 mb-6 font-normal">
                        <li><Link href="/product/details?variant=rectangle" className="hover:text-[#d4996a] transition-colors block">Variant Rectangle</Link></li>
                        <li><Link href="/product/details?variant=circle" className="hover:text-[#d4996a] transition-colors block">Variant Circle</Link></li>
                        <li><Link href="/product/details?variant=image_swatch" className="hover:text-[#d4996a] transition-colors block">Variant Image Swatch</Link></li>
                        <li><Link href="/product/details?variant=color" className="hover:text-[#d4996a] transition-colors block">Variant Color</Link></li>
                        <li><Link href="/product/details?variant=radio" className="hover:text-[#d4996a] transition-colors block">Variant Radio Button</Link></li>
                        <li><Link href="/product/details?variant=dropdown" className="hover:text-[#d4996a] transition-colors block">Variant Dropdown</Link></li>
                      </ul>

                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Product Features
                      </h4>
                      <ul className="space-y-2.5 text-[14px] text-[#bfb8b2] mt-2 font-normal">
                        <li><Link href="/product/details?feature=sticky_checkout" className="hover:text-[#d4996a] transition-colors block">Sticky Checkout</Link></li>
                        <li><Link href="/product/details?feature=secure_checkout" className="hover:text-[#d4996a] transition-colors block">Secure Checkout</Link></li>
                        <li><Link href="/product/details?feature=social_share" className="hover:text-[#d4996a] transition-colors block">Social Share</Link></li>
                        <li><Link href="/product/details?feature=related_products" className="hover:text-[#d4996a] transition-colors block">Related Products</Link></li>
                        <li><Link href="/product/details?feature=wishlist_compare" className="hover:text-[#d4996a] transition-colors block">Wishlist & Compare</Link></li>
                      </ul>
                    </div>

                    {/* Col 4: Sport3.jpg Banner Image full height */}
                    <div className="relative -my-7 -mr-7 h-[calc(100%+56px)] min-h-[480px] rounded-r-[3px] overflow-hidden">
                      <Image
                        src="/home/Sport3.jpg"
                        alt="Multikart The Best Minimal Theme"
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. MEGA MENU */}
            <div
              className="py-[15px] group"
              onMouseEnter={() => setActiveMenu("MEGAMENU")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href="#"
                className={`flex items-center text-[16px] font-medium transition-colors py-[15px] pr-[18px] pl-0 ${
                  activeMenu === "MEGAMENU" ? "text-[#d4996a]" : "text-[#ffffff] hover:text-[#d4996a]"
                }`}
              >
                <span className="mr-[6px]">Mega Menu</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "MEGAMENU" ? "rotate-180 text-[#d4996a]" : "text-[#aaaaaa]"
                  }`}
                />
              </Link>

              {activeMenu === "MEGAMENU" && (
                <div className="absolute left-0 top-full pt-0 w-[940px] z-50 animate-in fade-in duration-150">
                  <div className="bg-[#262626] text-[#ffffff] shadow-2xl p-7 rounded-[3px] border border-[#333333]">
                    <div className="grid grid-cols-4 gap-6 pb-6">
                      {/* Col 1: Top Brands */}
                      <div>
                        <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                          Top Brands
                        </h4>
                        <ul className="space-y-3 text-[14px] text-[#bfb8b2] mt-3 font-normal">
                          <li><Link href="/brand/sunsetglide-surfboards" className="hover:text-[#d4996a] transition-colors block">Sunsetglide Surfboards</Link></li>
                          <li><Link href="/brand/enigma-fragrance" className="hover:text-[#d4996a] transition-colors block">Enigma Fragrance</Link></li>
                          <li><Link href="/brand/driveline-depot" className="hover:text-[#d4996a] transition-colors block">Driveline Depot</Link></li>
                          <li><Link href="/brand/digital-haven" className="hover:text-[#d4996a] transition-colors block">Digital Haven</Link></li>
                          <li><Link href="/brand/lenscrafted" className="hover:text-[#d4996a] transition-colors block">Lenscrafted</Link></li>
                        </ul>
                      </div>

                      {/* Col 2: Popular Categories */}
                      <div>
                        <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                          Popular Categories
                        </h4>
                        <ul className="space-y-3 text-[14px] text-[#bfb8b2] mt-3 font-normal">
                          <li><Link href="/category/fashion" className="hover:text-[#d4996a] transition-colors block">Fashion</Link></li>
                          <li><Link href="/category/fitgear" className="hover:text-[#d4996a] transition-colors block">Fitgear</Link></li>
                          <li>
                            <Link href="/category/lingerie" className="flex items-center space-x-1.5 hover:text-[#d4996a] transition-colors">
                              <span>Lingerie</span>
                              <span className="bg-[#cca382] text-white text-[10px] px-1.5 py-0.5 rounded-[2px] font-normal leading-none">
                                Hot
                              </span>
                            </Link>
                          </li>
                          <li><Link href="/category/bag" className="hover:text-[#d4996a] transition-colors block">Bag</Link></li>
                          <li><Link href="/category/watch" className="hover:text-[#d4996a] transition-colors block">Watch</Link></li>
                        </ul>
                      </div>

                      {/* Col 3: Email Template */}
                      <div>
                        <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                          Email Template
                        </h4>
                        <ul className="space-y-3 text-[14px] text-[#bfb8b2] mt-3 font-normal">
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Welcome</Link></li>
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Abandonment</Link></li>
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Offer Template</Link></li>
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Order Success</Link></li>
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Review</Link></li>
                        </ul>
                      </div>

                      {/* Col 4: Email Template */}
                      <div>
                        <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                          Email Template
                        </h4>
                        <ul className="space-y-3 text-[14px] text-[#bfb8b2] mt-3 font-normal">
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Announcement</Link></li>
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Flash-sale</Link></li>
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Black Friday</Link></li>
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Christmas</Link></li>
                          <li><Link href="#" className="hover:text-[#d4996a] transition-colors block">Cyber Monday</Link></li>
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Banner Image: Sport4.png taking full width seamlessly */}
                    <div className="relative w-full h-[180px] rounded-[3px] overflow-hidden mt-4 bg-[#1b1918]">
                      <Image
                        src="/home/Sport4.png"
                        alt="Multikart 50+ Demos Banner"
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. BLOGS */}
            <div
              className="py-[15px] group"
              onMouseEnter={() => setActiveMenu("BLOGS")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href="/blogs"
                className={`flex items-center text-[16px] font-medium transition-colors py-[15px] pr-[18px] pl-0 ${
                  activeMenu === "BLOGS" ? "text-[#d4996a]" : "text-[#ffffff] hover:text-[#d4996a]"
                }`}
              >
                <span className="mr-[6px]">Blogs</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "BLOGS" ? "rotate-180 text-[#d4996a]" : "text-[#aaaaaa]"
                  }`}
                />
              </Link>

              {activeMenu === "BLOGS" && (
                <div className="absolute left-0 top-full pt-0 w-[740px] z-50 animate-in fade-in duration-150">
                  <div className="bg-[#262626] text-[#ffffff] shadow-2xl p-7 rounded-[3px] border border-[#333333] grid grid-cols-[1fr_2.4fr] gap-6">
                    {/* Col 1: Links */}
                    <div>
                      <h4 className="text-[#ffffff] text-[16px] font-semibold tracking-wide mb-3 pb-1.5 border-b border-[#cca382] inline-block">
                        Blog Page
                      </h4>
                      <ul className="space-y-3 text-[14px] text-[#bfb8b2] mt-3 font-normal">
                        <li>
                          <Link href="/blogs?style=grid_view&sidebar=left_sidebar" className="hover:text-[#d4996a] transition-colors block">
                            Grid Left Sidebar
                          </Link>
                        </li>
                        <li>
                          <Link href="/blogs?style=grid_view&sidebar=right_sidebar" className="hover:text-[#d4996a] transition-colors block">
                            Grid Right Sidebar
                          </Link>
                        </li>
                        <li>
                          <Link href="/blogs?style=grid_view&sidebar=no_sidebar" className="hover:text-[#d4996a] transition-colors block">
                            Grid No Sidebar
                          </Link>
                        </li>
                        <li>
                          <Link href="/blogs?style=list_view&sidebar=left_sidebar" className="flex items-center space-x-2 hover:text-[#d4996a] transition-colors">
                            <span>Blog List</span>
                            <span className="bg-[#cca382] text-white text-[10px] px-1.5 py-0.5 rounded-[2px] font-normal leading-none">
                              New
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Col 2: Sport5.png & Sport6.png */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Post 1 */}
                      <div className="group/post cursor-pointer">
                        <div className="relative w-full h-[145px] rounded-[2px] overflow-hidden mb-2 bg-[#ffffff]">
                          <Image
                            src="/home/Sport5.png"
                            alt="Elevate Your Space"
                            fill
                            className="object-cover group-hover/post:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-[11px] text-[#999999] block mb-1 font-normal">07 May 2025 07:15:AM</span>
                        <h6 className="text-[13px] font-medium text-white group-hover/post:text-[#d4996a] transition-colors leading-snug">
                          Elevate Your Space: The Art of Stylish Furnishing!
                        </h6>
                      </div>

                      {/* Post 2 */}
                      <div className="group/post cursor-pointer">
                        <div className="relative w-full h-[145px] rounded-[2px] overflow-hidden mb-2 bg-[#ffffff]">
                          <Image
                            src="/home/Sport6.png"
                            alt="Wardrobe Wonders"
                            fill
                            className="object-cover group-hover/post:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-[11px] text-[#999999] block mb-1 font-normal">06 May 2025 07:39:AM</span>
                        <h6 className="text-[13px] font-medium text-white group-hover/post:text-[#d4996a] transition-colors leading-snug">
                          Wardrobe Wonders: Unraveling the Enigma of Fashion
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. PAGES */}
            <div
              className="relative py-[15px] group"
              onMouseEnter={() => setActiveMenu("PAGES")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href="#"
                className={`flex items-center text-[16px] font-medium transition-colors py-[15px] pr-[18px] pl-0 ${
                  activeMenu === "PAGES" ? "text-[#d4996a]" : "text-[#ffffff] hover:text-[#d4996a]"
                }`}
              >
                <span className="mr-[6px]">Pages</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "PAGES" ? "rotate-180 text-[#d4996a]" : "text-[#aaaaaa]"
                  }`}
                />
              </Link>

              {activeMenu === "PAGES" && (
                <div className="absolute left-0 top-full pt-0 w-52 z-50 animate-in fade-in duration-150">
                  <div className="bg-[#262626] text-[#ffffff] shadow-2xl py-2 rounded-[3px] border border-[#333333]">
                    <Link href="/account/dashboard" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Account
                    </Link>
                    <Link href="/about-us" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      About Us
                    </Link>
                    <Link href="/faq" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Browse FAQs
                    </Link>
                    <Link href="/cart" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Cart
                    </Link>
                    <Link href="/offers" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Offers
                    </Link>
                    <Link href="/contact-us" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Contact Us
                    </Link>
                    <Link href="/compare" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Compare
                    </Link>
                    <Link href="/checkout" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Checkout
                    </Link>
                    <Link href="/search" className="flex items-center justify-between px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      <span>Search</span>
                      <span className="bg-[#cca382] text-white text-[9px] px-1.5 py-0.5 rounded-[2px] font-normal leading-none">
                        Hot
                      </span>
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Wishlist
                    </Link>
                    <Link href="/404" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      404
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 7. SELLER */}
            <div
              className="relative py-[15px] group"
              onMouseEnter={() => setActiveMenu("SELLER")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href="#"
                className={`flex items-center text-[16px] font-medium transition-colors py-[15px] pr-[18px] pl-0 ${
                  activeMenu === "SELLER" ? "text-[#d4996a]" : "text-[#ffffff] hover:text-[#d4996a]"
                }`}
              >
                <span className="mr-[6px]">Seller</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "SELLER" ? "rotate-180 text-[#d4996a]" : "text-[#aaaaaa]"
                  }`}
                />
              </Link>

              {activeMenu === "SELLER" && (
                <div className="absolute left-0 top-full pt-0 w-48 z-50 animate-in fade-in duration-150">
                  <div className="bg-[#262626] text-[#ffffff] shadow-2xl py-2 rounded-[3px] border border-[#333333]">
                    <Link href="/seller/become-seller" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Become Seller
                    </Link>
                    <Link href="/seller/stores" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Seller Stores
                    </Link>
                    <Link href="/seller/details" className="block px-4 py-2 text-[13px] text-[#bfb8b2] hover:bg-[#333333] hover:text-[#d4996a] transition-colors">
                      Store Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action Icons: On mobile shows Cart with beige badge + User */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5 text-white">
            {/* Search: Desktop only */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:block p-1 hover:text-[#d4996a] transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.8]" />
            </button>

            {/* Wishlist: Desktop only */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hidden lg:block relative p-1 hover:text-[#d4996a] transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#cca382] text-white font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart: Shows on all devices (with beige badge matching screenshot) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 hover:text-[#d4996a] transition-colors cursor-pointer group"
              aria-label="Shopping Cart"
            >
              <svg
                className="w-5 h-5 text-white fill-none stroke-current stroke-[1.9]"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#cca382] text-white font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Icon: Shows on all devices */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-1 hover:text-[#d4996a] transition-colors cursor-pointer"
              aria-label="Account"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Slide-Over Drawer matching user specifications:
          - Top header: X button on the left, "Menu" on the right
          - Rich content inside submenus: exactly what appears on large screens (categories, links, banners, images) adapted responsively
      */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] bg-[#232323] text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Top Drawer Header: X button on the Left, "Menu" on the Right */}
            <div className="px-5 py-4 border-b border-[#2e2e2e] flex items-center justify-between">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 -ml-1 flex items-center justify-center text-white hover:text-[#c7a78b] transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
              <span className="text-[17px] font-semibold text-[#c7a78b] tracking-wide">
                Menu
              </span>
            </div>

            {/* Menu Items List with full rich desktop contents inside each dropdown */}
            <div className="flex-1 overflow-y-auto px-4 divide-y divide-[#2a2a2a] py-2 select-none">
              {/* 1. Home */}
              <div className="py-3">
                <Link
                  href="/"
                  className="block text-[15px] font-medium text-white hover:text-[#c7a78b]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </div>

              {/* 2. Collection - with full layouts and product cards Sport1.jpg & Sport2.jpg */}
              <div className="py-3">
                <div
                  className="flex items-center justify-between cursor-pointer text-[15px] font-medium text-white hover:text-[#c7a78b]"
                  onClick={() => toggleMobileSubmenu("collection")}
                >
                  <span>Collection</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMobileSubmenu === "collection" ? "rotate-180 text-[#c7a78b]" : "text-white"
                    }`}
                  />
                </div>
                {openMobileSubmenu === "collection" && (
                  <div className="p-3 bg-[#1a1a1a] rounded border border-[#2d2d2d] my-2 space-y-4 animate-in fade-in duration-200">
                    {/* Collection Layouts Col 1 */}
                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Collection Layouts
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li>
                          <Link href="/collections?layout=collection_left_sidebar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] flex items-center space-x-1.5">
                            <span>Collection Left Sidebar</span>
                            <span className="bg-[#cca382] text-white text-[9px] px-1.5 py-0.5 rounded leading-none">Hot</span>
                          </Link>
                        </li>
                        <li><Link href="/collections?layout=collection_right_sidebar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection Right Sidebar</Link></li>
                        <li><Link href="/collections?layout=collection_no_sidebar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection No Sidebar</Link></li>
                        <li><Link href="/collections?layout=collection_2_grid" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection 2 grid</Link></li>
                        <li><Link href="/collections?layout=collection_3_grid" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection 3 Grid</Link></li>
                        <li><Link href="/collections?layout=collection_4_grid" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection 4 Grid</Link></li>
                        <li><Link href="/collections?layout=collection_list_view" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection list</Link></li>
                      </ul>
                    </div>

                    {/* Collection Layouts Col 2 */}
                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Collection Layouts
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li><Link href="/collections?layout=collection_category_slider" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection Category Slider</Link></li>
                        <li><Link href="/collections?layout=collection_category_sidebar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection Category Sidebar</Link></li>
                        <li><Link href="/collections?layout=collection_top_filter" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection Top Filter</Link></li>
                        <li><Link href="/collections?layout=collection_sidebar_popup" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Collection Sidebar Popup</Link></li>
                        <li><Link href="/collections?layout=collection_product_infinite_scroll" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Infinite Scroll</Link></li>
                      </ul>
                    </div>

                    {/* Products with Images (Sport1.jpg & Sport2.jpg) */}
                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2.5 pb-1 border-b border-[#cca382] inline-block">
                        Featured Products
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Product 1 */}
                        <div className="bg-[#242424] p-2 rounded border border-[#333333]">
                          <div className="relative w-full h-[140px] bg-[#ffffff] rounded overflow-hidden mb-2">
                            <span className="absolute top-1 left-1 bg-[#cca382] text-white text-[9px] px-1 py-0.5 rounded z-10 leading-none">
                              Featured
                            </span>
                            <Image
                              src="/home/Sport1.jpg"
                              alt="Gym Coords Set"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h5 className="text-[12px] font-medium text-white truncate">Gym Coords Set</h5>
                          <span className="text-[#cca382] text-[12px] font-semibold block mt-0.5">$15.00</span>
                        </div>

                        {/* Product 2 */}
                        <div className="bg-[#242424] p-2 rounded border border-[#333333]">
                          <div className="relative w-full h-[140px] bg-[#ffffff] rounded overflow-hidden mb-2">
                            <Image
                              src="/home/Sport2.jpg"
                              alt="Mini Dress"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#8254c4] inline-block"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#3e8a47] inline-block"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#823636] inline-block"></span>
                          </div>
                          <h5 className="text-[12px] font-medium text-white truncate">Mini Dress</h5>
                          <span className="text-[#cca382] text-[12px] font-semibold block mt-0.5">$15.20</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Product - with all features, styles and Sport3.jpg banner image */}
              <div className="py-3">
                <div
                  className="flex items-center justify-between cursor-pointer text-[15px] font-medium text-white hover:text-[#c7a78b]"
                  onClick={() => toggleMobileSubmenu("product")}
                >
                  <span>Product</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMobileSubmenu === "product" ? "rotate-180 text-[#c7a78b]" : "text-white"
                    }`}
                  />
                </div>
                {openMobileSubmenu === "product" && (
                  <div className="p-3 bg-[#1a1a1a] rounded border border-[#2d2d2d] my-2 space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Product Page
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li><Link href="/product/details?layout=product_thumbnail" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Thumbnail</Link></li>
                        <li><Link href="/product/details?layout=product_images" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Images</Link></li>
                        <li><Link href="/product/details?layout=product_slider" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Slider</Link></li>
                        <li><Link href="/product/details?layout=product_accordion" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Accordion</Link></li>
                        <li><Link href="/product/details?layout=product_sticky" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Sticky</Link></li>
                        <li><Link href="/product/details?layout=vertical_tab" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Vertical Tab</Link></li>
                        <li><Link href="/product/details?layout=product_sidebar_left" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Sidebar Left</Link></li>
                        <li><Link href="/product/details?layout=product_sidebar_right" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Sidebar Right</Link></li>
                        <li><Link href="/product/details?layout=product_no_sidebar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product No Sidebar</Link></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Product Features
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li><Link href="/product/details?feature=simple" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Simple</Link></li>
                        <li><Link href="/product/details?feature=classified" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Classified</Link></li>
                        <li><Link href="/product/details?feature=size_chart" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Size Chart</Link></li>
                        <li><Link href="/product/details?feature=delivery_return" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Delivery & Return</Link></li>
                        <li><Link href="/product/details?feature=review" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Product Review</Link></li>
                        <li><Link href="/product/details?feature=cross_sale" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Bundle (Cross Sale)</Link></li>
                        <li><Link href="/product/details?feature=hot_stock" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Hot Stock Progress</Link></li>
                        <li><Link href="/product/details?feature=out_stock" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Out Stock</Link></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Product Variants Style
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li><Link href="/product/details?variant=rectangle" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Variant Rectangle</Link></li>
                        <li><Link href="/product/details?variant=circle" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Variant Circle</Link></li>
                        <li><Link href="/product/details?variant=image_swatch" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Variant Image Swatch</Link></li>
                        <li><Link href="/product/details?variant=color" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Variant Color</Link></li>
                        <li><Link href="/product/details?variant=radio" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Variant Radio Button</Link></li>
                        <li><Link href="/product/details?variant=dropdown" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Variant Dropdown</Link></li>
                      </ul>
                    </div>

                    {/* Sport3.jpg Banner */}
                    <div className="relative w-full h-[180px] rounded overflow-hidden mt-3 border border-[#333333]">
                      <Image
                        src="/home/Sport3.jpg"
                        alt="Minimal Theme"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Mega Menu - with Top Brands, Categories, Email Templates & Sport4.png banner */}
              <div className="py-3">
                <div
                  className="flex items-center justify-between cursor-pointer text-[15px] font-medium text-white hover:text-[#c7a78b]"
                  onClick={() => toggleMobileSubmenu("megamenu")}
                >
                  <span>Mega Menu</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMobileSubmenu === "megamenu" ? "rotate-180 text-[#c7a78b]" : "text-white"
                    }`}
                  />
                </div>
                {openMobileSubmenu === "megamenu" && (
                  <div className="p-3 bg-[#1a1a1a] rounded border border-[#2d2d2d] my-2 space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Top Brands
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li><Link href="/brand/sunsetglide-surfboards" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Sunsetglide Surfboards</Link></li>
                        <li><Link href="/brand/enigma-fragrance" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Enigma Fragrance</Link></li>
                        <li><Link href="/brand/driveline-depot" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Driveline Depot</Link></li>
                        <li><Link href="/brand/digital-haven" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Digital Haven</Link></li>
                        <li><Link href="/brand/lenscrafted" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Lenscrafted</Link></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Popular Categories
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li><Link href="/category/fashion" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Fashion</Link></li>
                        <li><Link href="/category/fitgear" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Fitgear</Link></li>
                        <li>
                          <Link href="/category/lingerie" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-1.5 hover:text-[#c7a78b]">
                            <span>Lingerie</span>
                            <span className="bg-[#cca382] text-white text-[9px] px-1.5 py-0.5 rounded leading-none">Hot</span>
                          </Link>
                        </li>
                        <li><Link href="/category/bag" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Bag</Link></li>
                        <li><Link href="/category/watch" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Watch</Link></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Email Template
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li><Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Welcome</Link></li>
                        <li><Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Abandonment</Link></li>
                        <li><Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Offer Template</Link></li>
                        <li><Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Announcement</Link></li>
                        <li><Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Flash-sale</Link></li>
                        <li><Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Black Friday</Link></li>
                      </ul>
                    </div>

                    {/* Sport4.png Banner */}
                    <div className="relative w-full h-[120px] rounded overflow-hidden mt-3 border border-[#333333]">
                      <Image
                        src="/home/Sport4.png"
                        alt="Multikart Demos Banner"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Blogs - with Links and Blog Posts with Sport5.png & Sport6.png images */}
              <div className="py-3">
                <div
                  className="flex items-center justify-between cursor-pointer text-[15px] font-medium text-white hover:text-[#c7a78b]"
                  onClick={() => toggleMobileSubmenu("blogs")}
                >
                  <span>Blogs</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMobileSubmenu === "blogs" ? "rotate-180 text-[#c7a78b]" : "text-white"
                    }`}
                  />
                </div>
                {openMobileSubmenu === "blogs" && (
                  <div className="p-3 bg-[#1a1a1a] rounded border border-[#2d2d2d] my-2 space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2 pb-1 border-b border-[#cca382] inline-block">
                        Blog Page
                      </h4>
                      <ul className="space-y-2 text-[13px] text-[#bfb8b2] mt-1 font-normal">
                        <li><Link href="/blogs?style=grid_view&sidebar=left_sidebar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Grid Left Sidebar</Link></li>
                        <li><Link href="/blogs?style=grid_view&sidebar=right_sidebar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Grid Right Sidebar</Link></li>
                        <li><Link href="/blogs?style=grid_view&sidebar=no_sidebar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] block">Grid No Sidebar</Link></li>
                        <li>
                          <Link href="/blogs?style=list_view&sidebar=left_sidebar" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-1.5 hover:text-[#c7a78b]">
                            <span>Blog List</span>
                            <span className="bg-[#cca382] text-white text-[9px] px-1.5 py-0.5 rounded leading-none">New</span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[#ffffff] text-[14px] font-semibold mb-2.5 pb-1 border-b border-[#cca382] inline-block">
                        Recent Posts
                      </h4>
                      <div className="space-y-3">
                        {/* Post 1 */}
                        <div className="bg-[#242424] p-2.5 rounded border border-[#333333]">
                          <div className="relative w-full h-[120px] rounded overflow-hidden mb-2 bg-[#ffffff]">
                            <Image
                              src="/home/Sport5.png"
                              alt="Elevate Your Space"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[10px] text-[#999999] block mb-1">07 May 2025 07:15:AM</span>
                          <h6 className="text-[12px] font-medium text-white leading-snug">
                            Elevate Your Space: The Art of Stylish Furnishing!
                          </h6>
                        </div>

                        {/* Post 2 */}
                        <div className="bg-[#242424] p-2.5 rounded border border-[#333333]">
                          <div className="relative w-full h-[120px] rounded overflow-hidden mb-2 bg-[#ffffff]">
                            <Image
                              src="/home/Sport6.png"
                              alt="Wardrobe Wonders"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[10px] text-[#999999] block mb-1">06 May 2025 07:39:AM</span>
                          <h6 className="text-[12px] font-medium text-white leading-snug">
                            Wardrobe Wonders: Unraveling the Enigma of Fashion
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Pages - with all pages */}
              <div className="py-3">
                <div
                  className="flex items-center justify-between cursor-pointer text-[15px] font-medium text-white hover:text-[#c7a78b]"
                  onClick={() => toggleMobileSubmenu("pages")}
                >
                  <span>Pages</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMobileSubmenu === "pages" ? "rotate-180 text-[#c7a78b]" : "text-white"
                    }`}
                  />
                </div>
                {openMobileSubmenu === "pages" && (
                  <div className="p-3 bg-[#1a1a1a] rounded border border-[#2d2d2d] my-2 grid grid-cols-2 gap-2 text-[13px] text-[#bfb8b2] animate-in fade-in duration-200">
                    <Link href="/account/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">Account</Link>
                    <Link href="/about-us" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">About Us</Link>
                    <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">Browse FAQs</Link>
                    <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">Cart</Link>
                    <Link href="/offers" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">Offers</Link>
                    <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">Contact Us</Link>
                    <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">Compare</Link>
                    <Link href="/checkout" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">Checkout</Link>
                    <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between hover:text-[#c7a78b] py-1">
                      <span>Search</span>
                      <span className="bg-[#cca382] text-white text-[9px] px-1 rounded">Hot</span>
                    </Link>
                    <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">Wishlist</Link>
                    <Link href="/404" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#c7a78b] py-1">404</Link>
                  </div>
                )}
              </div>

              {/* 7. Seller - with all seller links */}
              <div className="py-3">
                <div
                  className="flex items-center justify-between cursor-pointer text-[15px] font-medium text-white hover:text-[#c7a78b]"
                  onClick={() => toggleMobileSubmenu("seller")}
                >
                  <span>Seller</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMobileSubmenu === "seller" ? "rotate-180 text-[#c7a78b]" : "text-white"
                    }`}
                  />
                </div>
                {openMobileSubmenu === "seller" && (
                  <div className="p-3 bg-[#1a1a1a] rounded border border-[#2d2d2d] my-2 space-y-2 text-[13px] text-[#bfb8b2] animate-in fade-in duration-200">
                    <Link href="/seller/become-seller" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#c7a78b] py-1">Become Seller</Link>
                    <Link href="/seller/stores" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#c7a78b] py-1">Seller Stores</Link>
                    <Link href="/seller/details" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#c7a78b] py-1">Store Details</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

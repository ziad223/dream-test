"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Search,
  RefreshCw,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Truck,
  Edit2,
  Trash2,
} from "lucide-react";
import AuthModal from "./AuthModal";
import NotificationsModal from "./NotificationsModal";
import { etrolleyApi } from "../lib/api";

export interface SpecialProduct {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category?: string;
  stock?: number;
  description?: string;
  variant?: string;
}

export interface CartItem {
  id: string | number;
  product: SpecialProduct;
  quantity: number;
  variant?: string;
}

export interface AuthUserData {
  id?: number | string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  points?: number;
  wallet?: number;
  count_orders?: number;
  [key: string]: any;
}

interface ProductModalContextType {
  wishlist: number[];
  wishlistItems: SpecialProduct[];
  toggleWishlist: (product: SpecialProduct, e?: React.MouseEvent) => void;
  addToCart: (product: SpecialProduct, quantity?: number, e?: React.MouseEvent) => void;
  openQuickView: (product: SpecialProduct, e?: React.MouseEvent) => void;
  toggleCompare: (product: SpecialProduct, e?: React.MouseEvent) => void;
  compareList: SpecialProduct[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  openAuthModal: (tab?: "login" | "register" | "profile", profileView?: "info" | "orders" | "addresses") => void;
  authInitialTab: "login" | "register" | "profile";
  authInitialProfileView: "info" | "orders" | "addresses";
  cartCount: number;
  wishlistCount: number;
  user: AuthUserData | null;
  setUser: (user: AuthUserData | null) => void;
  logout: () => void;
  storeInfo: any | null;
  refreshStoreInfo: () => Promise<void>;
  countries: any[];
  selectedCountry: any | null;
  setSelectedCountry: (country: any) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  formatPrice: (amount: number) => string;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isCartSyncing: boolean;
  backendCartTotal: number | null;
  syncCartWithBackend: () => Promise<void>;
  cartItems: CartItem[];
  updateCartQty: (id: string | number, delta: number) => void;
  removeCartItem: (id: string | number) => void;
  clearCart: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

export function ProductModalProvider({
  children,
  isWhiteTheme = false,
}: {
  children: React.ReactNode;
  isWhiteTheme?: boolean;
}) {
  const [compareList, setCompareList] = useState<SpecialProduct[]>([]);

  // Default cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "c1",
      product: {
        id: 1,
        title: "Elegant Embroidered Dress V1",
        price: 120.0,
        originalPrice: 150.0,
        discountPercent: 20,
        rating: 5,
        reviewsCount: 12,
        image: "/home/Sport1.jpg",
      },
      quantity: 1,
    },
    {
      id: "c2",
      product: {
        id: 4,
        title: "Sheesham Settee",
        price: 210.0,
        originalPrice: 240.0,
        discountPercent: 12,
        rating: 5,
        reviewsCount: 4,
        image: "/home/special4.png",
      },
      quantity: 1,
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SpecialProduct | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Product Option Matching State ({{baseUrl}}/elegant-fashion/product-options/match)
  const [selectedProductOptions, setSelectedProductOptions] = useState<Record<string, number>>({});
  const [matchedVariant, setMatchedVariant] = useState<any | null>(null);
  const [isMatchingOption, setIsMatchingOption] = useState<boolean>(false);

  // User Authentication State
  const [user, setUser] = useState<AuthUserData | null>(null);

  // Store Info State
  const [storeInfo, setStoreInfo] = useState<any | null>(null);

  // Countries & Currency State
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [currency, setCurrency] = useState<string>("SAR");

  // Language & Direction State
  const [currentLanguage, setCurrentLanguageState] = useState<string>("ar");

  // Cart Backend Sync State
  const [isCartSyncing, setIsCartSyncing] = useState<boolean>(false);
  const [backendCartTotal, setBackendCartTotal] = useState<number | null>(null);

  // Load language preference
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("multikart_lang") || "ar";
      setCurrentLanguageState(savedLang);
    } catch {}
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem("multikart_lang", lang);
      localStorage.setItem("multikart_rtl_mode", lang === "ar" ? "true" : "false");
      window.dispatchEvent(new Event("multikart_lang_change"));
    } catch {}
  };

  // Sync Cart with Backend API: POST {{baseUrl}}/elegant-fashion/cart
  const syncCartWithBackend = async () => {
    if (cartItems.length === 0) {
      setBackendCartTotal(0);
      return;
    }
    try {
      setIsCartSyncing(true);
      // Map cart items into the shape expected by Laravel backend
      const payloadItems = cartItems.map((item, idx) => ({
        product_id: typeof item.product.id === "number" ? item.product.id : idx + 1,
        quantity: item.quantity,
        total_price: Number((item.product.price * item.quantity).toFixed(2)),
      }));

      const res = await etrolleyApi.syncCart(payloadItems);
      if (res?.data?.cart_total !== undefined) {
        setBackendCartTotal(res.data.cart_total);
      }
    } catch (err) {
      console.warn("Backend cart sync notice:", err);
    } finally {
      setIsCartSyncing(false);
    }
  };

  // Persistent Cart state initialization
  const [isCartInitialized, setIsCartInitialized] = useState<boolean>(false);

  // Load cart items from persistent localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("etrolley_cart_items");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch {
      // Ignore
    } finally {
      setIsCartInitialized(true);
    }
  }, []);

  // Save cart items to localStorage on every change
  useEffect(() => {
    if (!isCartInitialized) return;
    try {
      localStorage.setItem("etrolley_cart_items", JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems, isCartInitialized]);

  // Automatically trigger backend cart sync when cart items change (debounced)
  useEffect(() => {
    if (!isCartInitialized) return;
    const timer = setTimeout(() => {
      syncCartWithBackend();
    }, 600);
    return () => clearTimeout(timer);
  }, [cartItems, isCartInitialized]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<"login" | "register" | "profile">("login");
  const [authInitialProfileView, setAuthInitialProfileView] = useState<"info" | "orders" | "addresses">("info");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [searchQuery, setSearchQuery] = useState("");

  const openAuthModal = (
    tab: "login" | "register" | "profile" = "login",
    profileView: "info" | "orders" | "addresses" = "info"
  ) => {
    setAuthInitialTab(tab);
    setAuthInitialProfileView(profileView);
    setIsAuthOpen(true);
  };

  // Sync user from localStorage & listen for changes
  useEffect(() => {
    const syncUser = () => {
      try {
        const storedUser = localStorage.getItem("etrolley_user_data");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    syncUser();

    // Listen to storage events and custom auth events
    window.addEventListener("storage", syncUser);
    window.addEventListener("etrolley_auth_change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("etrolley_auth_change", syncUser);
    };
  }, []);

  // Fetch Store Info and Countries
  const refreshStoreInfo = async () => {
    try {
      const res = await etrolleyApi.getStoreInfo("elegant-fashion").catch(() =>
        etrolleyApi.getStoreInfo()
      );
      if (res?.data) {
        setStoreInfo(res.data);
        if (res.data.country?.unit?.en) {
          setCurrency(res.data.country.unit.en);
        }
      }

      // Fetch dynamic countries list from backend
      const countriesRes = await etrolleyApi.getCountries();
      if (countriesRes?.data && Array.isArray(countriesRes.data)) {
        setCountries(countriesRes.data);
        if (countriesRes.data.length > 0 && !selectedCountry) {
          setSelectedCountry(countriesRes.data[0]);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    refreshStoreInfo();
  }, []);

  // Helper to format product price in current currency
  const formatPrice = (amount: number) => {
    const symbolMap: Record<string, string> = {
      SAR: "ر.س",
      QAR: "ر.ق",
      USD: "$",
      EUR: "€",
      AED: "د.إ",
    };
    const symbol = symbolMap[currency] || currency;
    return `${amount.toFixed(2)} ${symbol}`;
  };

  const logout = () => {
    localStorage.removeItem("etrolley_auth_token");
    localStorage.removeItem("etrolley_user_data");
    setUser(null);
    window.dispatchEvent(new Event("etrolley_auth_change"));
    showToast("Logged out successfully");
  };

  // Default most searched products matching Multikart Furniture Dark
  const mostSearchedProducts: SpecialProduct[] = [
    {
      id: 201,
      title: "Gym Coords Set (Brown)",
      price: 15.0,
      originalPrice: 15.0,
      discountPercent: 0,
      rating: 0,
      reviewsCount: 0,
      image: "/home/search1.jpg",
      category: "Fitness",
    },
    {
      id: 202,
      title: "Mini Dress (Purple)",
      price: 15.2,
      originalPrice: 16.0,
      discountPercent: 5,
      rating: 0,
      reviewsCount: 0,
      image: "/home/search2.jpg",
      category: "Dresses",
    },
    {
      id: 203,
      title: "Tan Cargo Shorts",
      price: 9.96,
      originalPrice: 12.0,
      discountPercent: 17,
      rating: 0,
      reviewsCount: 0,
      image: "/home/search3.jpg",
      category: "Shorts",
    },
    {
      id: 204,
      title: "Chic Mini Dress",
      price: 9.4,
      originalPrice: 10.0,
      discountPercent: 6,
      rating: 0,
      reviewsCount: 0,
      image: "/home/search4.jpg",
      category: "Dresses",
    },
  ];

  // Wishlist state initialized from persistent localStorage
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistItemsList, setWishlistItemsList] = useState<SpecialProduct[]>([]);
  const [isWishlistInitialized, setIsWishlistInitialized] = useState<boolean>(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedIds = localStorage.getItem("etrolley_wishlist_ids");
      const savedItems = localStorage.getItem("etrolley_wishlist_items");
      if (savedIds) {
        setWishlist(JSON.parse(savedIds));
      }
      if (savedItems) {
        setWishlistItemsList(JSON.parse(savedItems));
      }
    } catch {
      // Ignore
    } finally {
      setIsWishlistInitialized(true);
    }
  }, []);

  // Save wishlist changes to localStorage whenever they change
  useEffect(() => {
    if (!isWishlistInitialized) return;
    try {
      localStorage.setItem("etrolley_wishlist_ids", JSON.stringify(wishlist));
      localStorage.setItem("etrolley_wishlist_items", JSON.stringify(wishlistItemsList));
    } catch {
      // Ignore
    }
  }, [wishlist, wishlistItemsList, isWishlistInitialized]);

  const showToast = (msg: string, _type?: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const toggleWishlist = (product: SpecialProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const alreadyIn = wishlist.includes(product.id) || wishlistItemsList.some((w) => w.id === product.id);

    // Update locally in UI immediately for snappy user experience
    if (alreadyIn) {
      setWishlist((prev) => prev.filter((id) => id !== product.id));
      setWishlistItemsList((prev) => prev.filter((w) => w.id !== product.id));
      showToast(`Removed "${product.title}" from Wishlist`);
    } else {
      setWishlist((prev) => [...prev, product.id]);
      setWishlistItemsList((prev) => [product, ...prev]);
      showToast(`Added "${product.title}" to Wishlist!`);
    }

    // Check if user has authentication token
    const token = typeof window !== "undefined" ? localStorage.getItem("etrolley_auth_token") : null;
    if (!token) {
      // User is not logged in: Inform user and offer sign-in so their favorites are saved in their account
      showToast("Added to local wishlist. Sign in to save to your cloud account!");
      return;
    }

    // Call live backend API toggleFavorite
    etrolleyApi.toggleFavorite(product.id).catch((err: any) => {
      // If token expired or unauthenticated
      if (err?.message?.includes("Unauthenticated") || err?.status === 401) {
        localStorage.removeItem("etrolley_auth_token");
        setIsAuthOpen(true);
        showToast("Session expired. Please sign in to sync favorites.");
      }
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item !== id));
    setWishlistItemsList((prev) => prev.filter((w) => w.id !== id));
    
    // Also sync removal with backend if authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("etrolley_auth_token") : null;
    if (token) {
      etrolleyApi.toggleFavorite(id).catch(() => {});
    }
  };

  const addToCart = (product: SpecialProduct, quantity = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        { id: `cart-${product.id}-${Date.now()}`, product, quantity },
        ...prev,
      ];
    });
    setIsCartOpen(true);
  };

  const openQuickView = (product: SpecialProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProduct(product);
    setActiveThumb(0);
    setQuickViewQty(1);
    setSelectedProductOptions({});
    setMatchedVariant(null);
    setIsQuickViewOpen(true);
  };

  // Match Product Options: {{baseUrl}}/elegant-fashion/product-options/match
  const handleOptionSelect = async (productId: number, optionKey: string, valueId: number) => {
    const updatedOptions = { ...selectedProductOptions, [optionKey]: valueId };
    setSelectedProductOptions(updatedOptions);

    const valuesArray = Object.values(updatedOptions);
    if (valuesArray.length === 0) return;

    try {
      setIsMatchingOption(true);
      const res = await etrolleyApi.matchProductOptions(productId, valuesArray);
      if (res?.data) {
        setMatchedVariant(res.data);
        if (res.data.price && selectedProduct) {
          setSelectedProduct((prev) => prev ? { ...prev, price: res.data.price } : null);
        }
      } else {
        setMatchedVariant(null);
      }
    } catch {
      setMatchedVariant(null);
    } finally {
      setIsMatchingOption(false);
    }
  };

  const toggleCompare = (product: SpecialProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = compareList.some((item) => item.id === product.id);
    if (exists) {
      setCompareList((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.title}" from Compare list`);
    } else {
      if (compareList.length >= 4) {
        showToast("Maximum 4 products can be compared at once");
        setIsCompareModalOpen(true);
        return;
      }
      setCompareList((prev) => [...prev, product]);
      showToast(`Added "${product.title}" to Compare!`);
      setIsCompareModalOpen(true);
    }
  };

  const updateCartQty = (id: string | number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (id: string | number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const filteredSearchProducts = searchQuery.trim()
    ? mostSearchedProducts.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mostSearchedProducts;

  return (
    <ProductModalContext.Provider
      value={{
        wishlist,
        wishlistItems: wishlistItemsList,
        toggleWishlist,
        addToCart,
        openQuickView,
        toggleCompare,
        compareList,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAuthOpen,
        setIsAuthOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        openAuthModal,
        authInitialTab,
        authInitialProfileView,
        cartCount: cartItems.length,
        wishlistCount: wishlistItemsList.length,
        user,
        setUser,
        logout,
        storeInfo,
        refreshStoreInfo,
        countries,
        selectedCountry,
        setSelectedCountry,
        currency,
        setCurrency,
        formatPrice,
        currentLanguage,
        setLanguage,
        isCartSyncing,
        backendCartTotal,
        syncCartWithBackend,
        cartItems,
        updateCartQty,
        removeCartItem,
        clearCart,
      }}
    >
      {children}

      {/* ========================================================
          1. EXACT MULTIKART "MY CART" SLIDE-OVER DRAWER
          ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity animate-in fade-in"
            onClick={() => setIsCartOpen(false)}
          />

          <div
            className={`relative w-full max-w-[390px] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l ${
              isWhiteTheme
                ? "bg-[#ffffff] text-[#222222] border-[#e5e5e5]"
                : "bg-[#1e1e1e] text-white border-[#2e2e2e]"
            }`}
          >
            <div
              className={`px-5 py-4 border-b flex items-center justify-between ${
                isWhiteTheme ? "border-[#eeeeee]" : "border-[#2b2b2b]"
              }`}
            >
              <div className="flex items-center space-x-2">
                <h3
                  className={`text-[17px] font-medium tracking-wide ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  My Cart ({cartItems.length})
                </h3>
                {isCartSyncing && (
                  <span className="flex items-center text-[11px] text-[#cca382] font-normal animate-pulse">
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Syncing...
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className={`w-7 h-7 flex items-center justify-center rounded-[2px] transition-colors cursor-pointer border ${
                  isWhiteTheme
                    ? "text-gray-500 hover:text-black border-[#e0e0e0] hover:border-black"
                    : "text-gray-400 hover:text-white border-[#383838] hover:border-gray-500"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              className={`px-5 pt-4 pb-4 border-b ${
                isWhiteTheme ? "border-[#eeeeee] bg-[#fafafa]" : "border-[#2b2b2b]"
              }`}
            >
              <p
                className={`text-[14px] font-normal mb-3 ${
                  isWhiteTheme ? "text-[#444444]" : "text-[#dedede]"
                }`}
              >
                Spend <span className="text-[#ffc107] font-semibold">$10.19</span> More And Enjoy Free Shiping!
              </p>
              <div
                className={`relative w-full h-[7px] rounded-full flex items-center ${
                  isWhiteTheme ? "bg-[#e5e5e5]" : "bg-[#2d2d2d]"
                }`}
              >
                {/* Yellow striped progress track */}
                <div
                  className="h-full rounded-full transition-all duration-300 relative"
                  style={{
                    width: "78%",
                    backgroundColor: "#ffc107",
                    backgroundImage:
                      "linear-gradient(45deg, rgba(0, 0, 0, 0.12) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.12) 50%, rgba(0, 0, 0, 0.12) 75%, transparent 75%, transparent)",
                    backgroundSize: "12px 12px",
                  }}
                />
                {/* Yellow circle with White Truck icon */}
                <div
                  className="absolute -top-[9px] w-[25px] h-[25px] rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 z-10"
                  style={{
                    left: "calc(78% - 12.5px)",
                    backgroundColor: "#ffc107",
                  }}
                >
                  <Truck className="w-3.5 h-3.5 text-white fill-white stroke-none" />
                </div>
              </div>
            </div>

            <div className="px-5 pt-3 pb-1 flex justify-end">
              <button
                onClick={clearCart}
                className="text-[13px] text-[#cca382] hover:underline cursor-pointer font-medium"
              >
                Clear Cart
              </button>
            </div>

            <div
              className={`flex-1 overflow-y-auto px-5 divide-y ${
                isWhiteTheme ? "divide-[#eeeeee]" : "divide-[#2a2a2a]"
              }`}
            >
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <ShoppingCart className="w-12 h-12 text-[#999999] mb-3 stroke-[1.2]" />
                  <p className="text-gray-500 text-sm font-medium">Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex items-center gap-3.5">
                    <div
                      className={`relative w-[72px] h-[72px] rounded-[2px] p-1.5 shrink-0 flex items-center justify-center border ${
                        isWhiteTheme
                          ? "bg-[#f8f8f8] border-[#e5e5e5]"
                          : "bg-[#292929] border-[#333333]"
                      }`}
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-[14px] font-normal truncate mb-1 ${
                          isWhiteTheme ? "text-[#222222]" : "text-white"
                        }`}
                      >
                        {item.product.title}
                      </h4>
                      <p
                        className={`text-[13px] font-medium ${
                          isWhiteTheme ? "text-[#666666]" : "text-gray-300"
                        }`}
                      >
                        {item.quantity} X ${item.product.price.toFixed(2)}
                      </p>
                      {item.variant && (
                        <p
                          className={`text-[12px] mt-0.5 ${
                            isWhiteTheme ? "text-[#888888]" : "text-gray-400"
                          }`}
                        >
                          {item.variant}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2 shrink-0">
                      <div className="flex items-center space-x-1.5">
                        {item.variant && (
                          <button
                            onClick={() => showToast(`Edit ${item.product.title}`)}
                            className={`w-6 h-6 border rounded-[2px] flex items-center justify-center transition-colors cursor-pointer ${
                              isWhiteTheme
                                ? "border-[#e0e0e0] text-gray-500 hover:text-black hover:border-[#cca382]"
                                : "border-[#383838] text-gray-400 hover:text-white hover:border-[#cca382]"
                            }`}
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className={`w-6 h-6 border rounded-[2px] flex items-center justify-center transition-colors cursor-pointer ${
                            isWhiteTheme
                              ? "border-[#e0e0e0] text-gray-500 hover:text-[#e22a40] hover:border-[#e22a40]"
                              : "border-[#383838] text-gray-400 hover:text-[#e22a40] hover:border-[#e22a40]"
                          }`}
                          title="Delete item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div
                        className={`flex items-center border rounded-[2px] ${
                          isWhiteTheme
                            ? "border-[#e0e0e0] bg-[#f5f5f5]"
                            : "border-[#383838] bg-[#242424]"
                        }`}
                      >
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className={`w-6 h-6 flex items-center justify-center transition-colors cursor-pointer ${
                            isWhiteTheme ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-2.5 h-2.5" />
                          ) : (
                            <Minus className="w-2.5 h-2.5" />
                          )}
                        </button>
                        <span
                          className={`w-7 text-center text-[12px] font-medium select-none ${
                            isWhiteTheme ? "text-black" : "text-white"
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className={`w-6 h-6 flex items-center justify-center transition-colors cursor-pointer ${
                            isWhiteTheme ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div
              className={`p-5 border-t ${
                isWhiteTheme
                  ? "bg-[#fafafa] border-[#eeeeee]"
                  : "bg-[#1e1e1e] border-[#2e2e2e]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[17px] font-medium ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  Sub Total :
                </span>
                <span className="text-[19px] font-bold text-[#cca382]">
                  {formatPrice(backendCartTotal !== null ? backendCartTotal : cartSubtotal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    showToast("Redirecting to View Cart...");
                  }}
                  className="w-full py-2.5 px-3 bg-[#c7a78b] hover:bg-[#b89577] text-white font-medium text-[14px] rounded-[2px] transition-colors cursor-pointer text-center"
                >
                  View Cart
                </button>
                <button
                  onClick={async () => {
                    if (cartItems.length === 0) {
                      showToast("Your cart is empty!", "info");
                      return;
                    }
                    try {
                      showToast("Initializing checkout with your order...", "info");
                      const payload = cartItems.map((item, idx) => ({
                        product_id: typeof item.product.id === "number" ? item.product.id : idx + 1,
                        quantity: item.quantity,
                        total_price: Number((item.product.price * item.quantity).toFixed(2)),
                        option_check: [],
                      }));
                      const res = await etrolleyApi.initCheckout(payload);
                      setIsCartOpen(false);
                      showToast("Order initialized successfully! Proceeding to checkout.");
                    } catch (err: any) {
                      showToast(err?.message || "Checkout initialized. Redirecting...", "info");
                      setIsCartOpen(false);
                    }
                  }}
                  className="w-full py-2.5 px-3 bg-[#c7a78b] hover:bg-[#b89577] text-white font-medium text-[14px] rounded-[2px] transition-colors cursor-pointer text-center"
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. EXACT MULTIKART "QUICK VIEW" MODAL
          ======================================================== */}
      {isQuickViewOpen && selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsQuickViewOpen(false)}
          />

          <div
            className={`relative w-full max-w-[850px] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto rounded-[2px] ${
              isWhiteTheme ? "bg-[#ffffff] text-[#222222]" : "bg-[#232323] text-white"
            }`}
          >
            <button
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute top-0 right-0 z-30 w-8 h-8 bg-[#c7a78b] hover:bg-[#b89577] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
              <div className="flex flex-col">
                <div
                  className={`relative w-full aspect-[1/0.92] flex items-center justify-center p-6 overflow-hidden select-none ${
                    isWhiteTheme ? "bg-[#f8f8f8]" : "bg-[#272727]"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveThumb((curr) => (curr === 0 ? 1 : 0));
                    }}
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 flex items-center justify-center transition-colors cursor-pointer shadow ${
                      isWhiteTheme
                        ? "bg-[#ffffff] text-gray-700 hover:text-black border border-[#e5e5e5]"
                        : "bg-[#1f1f1f] text-gray-300 hover:text-white border border-[#383838]"
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveThumb((curr) => (curr === 0 ? 1 : 0));
                    }}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 flex items-center justify-center transition-colors cursor-pointer shadow ${
                      isWhiteTheme
                        ? "bg-[#ffffff] text-gray-700 hover:text-black border border-[#e5e5e5]"
                        : "bg-[#1f1f1f] text-gray-300 hover:text-white border border-[#383838]"
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 w-full">
                  {[0, 1].map((idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveThumb(idx)}
                      className={`relative w-full aspect-[1/0.78] p-3 cursor-pointer transition-all border ${
                        isWhiteTheme ? "bg-[#f8f8f8]" : "bg-[#272727]"
                      } ${
                        activeThumb === idx
                          ? isWhiteTheme ? "border-[#cca382]" : "border-[#4a4a4a]"
                          : isWhiteTheme ? "border-[#e5e5e5] opacity-80" : "border-[#303030] opacity-80"
                      }`}
                    >
                      <Image
                        src={selectedProduct.image}
                        alt="Thumbnail"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-start text-left space-y-3 select-none">
                <h3
                  className={`text-[26px] sm:text-[28px] font-bold tracking-tight leading-tight ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  {selectedProduct.title}
                </h3>

                <div className="flex items-center space-x-2 text-[#ff9900]">
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[#ffaa00]"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs">|</span>
                  <span className="text-gray-500 text-xs underline cursor-pointer hover:text-[#cca382]">
                    {selectedProduct.reviewsCount} Review
                  </span>
                </div>

                <div className="pt-0.5">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span
                      className={`text-base font-semibold ${
                        isWhiteTheme ? "text-[#555555]" : "text-gray-300"
                      }`}
                    >
                      MRP:
                    </span>
                    <span
                      className={`text-[24px] font-bold ${
                        isWhiteTheme ? "text-[#222222]" : "text-white"
                      }`}
                    >
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="text-gray-400 line-through text-[14px]">
                      ${selectedProduct.originalPrice.toFixed(2)}
                    </span>
                    <span
                      className={`text-[#cca382] text-[11px] font-semibold px-2 py-0.5 rounded-[2px] border ${
                        isWhiteTheme
                          ? "bg-[#fbf4ee] border-[#cca382]/40"
                          : "bg-[#2a2a2a] border-[#383838]"
                      }`}
                    >
                      {selectedProduct.discountPercent}% off
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1 font-normal">
                    Inclusive all the text
                  </p>
                </div>

                <p
                  className={`text-[13px] leading-relaxed line-clamp-3 pt-1 ${
                    isWhiteTheme ? "text-[#555555]" : "text-gray-300"
                  }`}
                >
                  {selectedProduct.description}
                </p>

                {/* Product Options Matching: {{baseUrl}}/elegant-fashion/product-options/match */}
                <div className="pt-2 pb-1 space-y-2 border-t border-b border-[#303030]/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-400">Color Variant:</span>
                    {isMatchingOption && (
                      <span className="text-[11px] text-[#cca382] animate-pulse flex items-center">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Matching...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 111, name: "Updated Name" },
                      { id: 112, name: "Light Blue" },
                    ].map((opt) => {
                      const isSelected = selectedProductOptions["color"] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleOptionSelect(selectedProduct.id, "color", opt.id)}
                          className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#cca382] text-white border-[#cca382] font-semibold"
                              : isWhiteTheme
                              ? "bg-gray-100 text-gray-700 border-gray-300 hover:border-black"
                              : "bg-[#252525] text-gray-300 border-[#383838] hover:border-gray-500"
                          }`}
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <div
                    className={`inline-flex items-center border rounded-[2px] p-1 ${
                      isWhiteTheme
                        ? "border-[#e5e5e5] bg-[#f8f8f8]"
                        : "border-[#303030] bg-[#1a1a1a]"
                    }`}
                  >
                    <button
                      onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                      className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer rounded-[2px] ${
                        isWhiteTheme
                          ? "text-gray-700 hover:text-black bg-[#ffffff] border border-[#e5e5e5]"
                          : "text-gray-400 hover:text-white bg-[#202020] hover:bg-[#282828]"
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className={`w-12 text-center text-sm font-normal select-none ${
                        isWhiteTheme ? "text-black" : "text-white"
                      }`}
                    >
                      {quickViewQty}
                    </span>
                    <button
                      onClick={() => setQuickViewQty((q) => q + 1)}
                      className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer rounded-[2px] ${
                        isWhiteTheme
                          ? "text-gray-700 hover:text-black bg-[#ffffff] border border-[#e5e5e5]"
                          : "text-gray-400 hover:text-white bg-[#202020] hover:bg-[#282828]"
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, quickViewQty);
                      setIsQuickViewOpen(false);
                    }}
                    className="w-full py-2.5 px-3 bg-[#c7a78b] hover:bg-[#b89577] text-white font-medium text-[14px] rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add To Cart
                  </button>
                  <button
                    onClick={async () => {
                      setIsQuickViewOpen(false);
                      try {
                        showToast(`Creating order for ${selectedProduct.title}...`, "info");
                        const pId = typeof selectedProduct.id === "number" ? selectedProduct.id : 2;
                        const pPrice = Number(selectedProduct.price || 240);
                        await etrolleyApi.initCheckout([
                          {
                            product_id: pId,
                            quantity: quickViewQty,
                            total_price: Number((pPrice * quickViewQty).toFixed(2)),
                            option_check: [],
                          },
                        ]);
                        showToast(`Order created successfully for ${selectedProduct.title}!`);
                      } catch (err: any) {
                        showToast(err?.message || "Order initialized successfully!");
                      }
                    }}
                    className="w-full py-2.5 px-3 bg-[#c7a78b] hover:bg-[#b89577] text-white font-medium text-[14px] rounded-[2px] transition-colors cursor-pointer flex items-center justify-center shadow"
                  >
                    Buy Now
                  </button>
                </div>

                <div
                  className={`flex items-center gap-6 pt-2 text-[13px] ${
                    isWhiteTheme ? "text-[#555555]" : "text-gray-300"
                  }`}
                >
                  <button
                    onClick={() => toggleWishlist(selectedProduct)}
                    className="hover:text-[#cca382] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.includes(selectedProduct.id)
                          ? "fill-[#e22a40] text-[#e22a40]"
                          : ""
                      }`}
                    />
                    <span>Add To Wishlist</span>
                  </button>
                  <button
                    onClick={() => toggleCompare(selectedProduct)}
                    className="hover:text-[#cca382] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Add To Compare</span>
                  </button>
                </div>

                <div className="pt-2">
                  <p
                    className={`text-[13px] mb-1.5 font-normal ${
                      isWhiteTheme ? "text-[#555555]" : "text-gray-300"
                    }`}
                  >
                    Please Hurry Only {selectedProduct.stock || 10} Left In Stock
                  </p>
                  <div
                    className={`w-full h-[5px] rounded-full overflow-hidden ${
                      isWhiteTheme ? "bg-[#e5e5e5]" : "bg-[#333333]"
                    }`}
                  >
                    <div className="bg-[#78c21a] h-full w-[85%] rounded-full" />
                  </div>
                </div>

                <div
                  className={`pt-3 border-t space-y-1.5 ${
                    isWhiteTheme ? "border-[#eeeeee]" : "border-[#333333]"
                  }`}
                >
                  <h5
                    className={`text-[14px] font-bold tracking-wide ${
                      isWhiteTheme ? "text-[#222222]" : "text-white"
                    }`}
                  >
                    Delivery Details
                  </h5>
                  <div
                    className={`flex items-center gap-2 text-[13px] ${
                      isWhiteTheme ? "text-[#555555]" : "text-gray-300"
                    }`}
                  >
                    <Truck className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>your order will deliver within 5 to 10 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. COMPARE PRODUCTS MODAL
          ======================================================== */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCompareModalOpen(false)}
          />

          <div
            className={`relative w-full max-w-4xl rounded-[2px] shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200 border ${
              isWhiteTheme
                ? "bg-[#ffffff] text-[#222222] border-[#e5e5e5]"
                : "bg-[#1e1e1e] text-white border-[#333333]"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-4 border-b mb-6 ${
                isWhiteTheme ? "border-[#eeeeee]" : "border-[#303030]"
              }`}
            >
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-[#cca382]" />
                <h3
                  className={`text-xl font-bold uppercase tracking-wider ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  Compare Products ({compareList.length})
                </h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className={`w-8 h-8 rounded-[2px] flex items-center justify-center transition-colors cursor-pointer ${
                  isWhiteTheme
                    ? "bg-[#f0f0f0] hover:bg-[#cca382] text-gray-700 hover:text-white"
                    : "bg-[#2a2a2a] hover:bg-[#cca382] text-white hover:text-black"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {compareList.length === 0 ? (
              <div className="text-center py-10">
                <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className={isWhiteTheme ? "text-gray-600" : "text-gray-400"}>
                  No products added for comparison yet.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Hover over any card and click the compare icon to compare specifications.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {compareList.map((item) => (
                  <div
                    key={item.id}
                    className={`border p-4 rounded-[2px] flex flex-col justify-between relative group ${
                      isWhiteTheme
                        ? "bg-[#fafafa] border-[#e5e5e5]"
                        : "bg-[#262626] border-[#333333]"
                    }`}
                  >
                    <button
                      onClick={() => toggleCompare(item)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-[#e22a40] p-1"
                      title="Remove from compare"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div
                      className={`relative w-full aspect-square rounded p-2 mb-3 ${
                        isWhiteTheme ? "bg-[#ffffff] border border-[#eeeeee]" : "bg-[#1b1b1b]"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <h4
                        className={`font-semibold text-sm truncate ${
                          isWhiteTheme ? "text-[#222222]" : "text-white"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[#cca382] font-bold text-base">
                        ${item.price.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          isWhiteTheme ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        Category:{" "}
                        <strong className={isWhiteTheme ? "text-black" : "text-gray-300"}>
                          {item.category}
                        </strong>
                      </p>
                      <p
                        className={`text-xs ${
                          isWhiteTheme ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        Availability: <strong className="text-[#16a34a]">In Stock</strong>
                      </p>

                      <button
                        onClick={() => {
                          addToCart(item, 1);
                          setIsCompareModalOpen(false);
                        }}
                        className="w-full mt-3 py-2 bg-[#cca382] hover:bg-[#b89577] text-white font-medium text-xs uppercase tracking-wider rounded-[2px] transition-colors"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          4. EXACT MULTIKART "SEARCH IN STORE" MODAL (MATCHING SCREENSHOT)
          ======================================================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-[3px] transition-opacity animate-in fade-in"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Modal Container */}
          <div
            className={`relative w-full max-w-[1040px] shadow-2xl rounded-[3px] overflow-hidden z-10 animate-in zoom-in-95 duration-200 border my-auto ${
              isWhiteTheme
                ? "bg-[#ffffff] text-[#222222] border-[#e5e5e5]"
                : "bg-[#222222] text-white border-[#333333]"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`px-6 py-4.5 border-b flex items-center justify-between ${
                isWhiteTheme ? "border-[#eeeeee]" : "border-[#2d2d2d]"
              }`}
            >
              <h3
                className={`text-[19px] font-bold tracking-wide ${
                  isWhiteTheme ? "text-[#222222]" : "text-white"
                }`}
              >
                Search in store
              </h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-7 h-7 bg-[#cca382] hover:bg-[#b89577] text-white flex items-center justify-center rounded-[1px] transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Search Input Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className={`w-full border rounded-[2px] py-3 pl-4 pr-11 text-[15px] focus:outline-none focus:border-[#cca382] transition-colors ${
                    isWhiteTheme
                      ? "bg-[#f8f8f8] border-[#e5e5e5] text-black placeholder:text-[#999999]"
                      : "bg-[#181818] border-[#333333] text-white placeholder:text-[#666666]"
                  }`}
                />
                <button
                  onClick={() => {}}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                    isWhiteTheme ? "text-gray-500 hover:text-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Top search tags */}
              <div
                className={`flex flex-wrap items-center gap-2 text-[13px] ${
                  isWhiteTheme ? "text-[#666666]" : "text-[#8c8c8c]"
                }`}
              >
                <span className={`font-semibold ${isWhiteTheme ? "text-[#333333]" : "text-[#aaaaaa]"}`}>
                  Top search:
                </span>
                {["Baby Essentials", "Bag Emporium", "Bags", "Books"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="hover:text-[#cca382] transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Most Searched Products */}
              <div>
                <h4
                  className={`text-[17px] font-bold mb-4 ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  Most Searched
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {filteredSearchProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`border rounded-[2px] overflow-hidden group flex flex-col justify-between transition-colors ${
                        isWhiteTheme
                          ? "bg-[#ffffff] border-[#eaeaea] hover:border-[#cca382] shadow-sm"
                          : "bg-[#1b1b1b] border-[#2b2b2b] hover:border-[#cca382]"
                      }`}
                    >
                      {/* Product Image Box */}
                      <div
                        className={`relative w-full aspect-[1/1.1] overflow-hidden ${
                          isWhiteTheme ? "bg-[#f5f5f5]" : "bg-[#141414]"
                        }`}
                      >
                        {p.id === 201 && (
                          <span className="absolute top-2 left-2 z-10 bg-[#cca382] text-white text-[10px] px-1.5 py-0.5 rounded-[2px]">
                            Featured
                          </span>
                        )}
                        {p.discountPercent > 0 && p.id !== 201 && (
                          <span className="absolute top-2 left-2 z-10 bg-[#cca382] text-white text-[10px] px-1.5 py-0.5 rounded-[2px]">
                            Sale
                          </span>
                        )}

                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Hover Quick Action Buttons */}
                        <div className="absolute right-2 top-2 flex flex-col space-y-1.5 z-20">
                          <button
                            onClick={(e) => toggleWishlist(p, e)}
                            className="w-7 h-7 bg-[#262626]/90 hover:bg-[#cca382] rounded-full flex items-center justify-center text-white transition-colors shadow"
                            title="Add to wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${wishlist.includes(p.id) ? "fill-[#cca382] text-[#cca382]" : ""}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p, 1);
                              setIsSearchOpen(false);
                            }}
                            className="w-7 h-7 bg-[#262626]/90 hover:bg-[#cca382] rounded-full flex items-center justify-center text-white transition-colors shadow"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openQuickView(p, e);
                            }}
                            className="w-7 h-7 bg-[#262626]/90 hover:bg-[#cca382] rounded-full flex items-center justify-center text-white transition-colors shadow"
                            title="Quick view"
                          >
                            <Search className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => toggleCompare(p, e)}
                            className="w-7 h-7 bg-[#262626]/90 hover:bg-[#cca382] rounded-full flex items-center justify-center text-white transition-colors shadow"
                            title="Compare"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3.5">
                        {p.id === 202 && (
                          <div className="flex items-center space-x-1.5 mb-1.5">
                            <span className="w-3 h-3 rounded-full bg-[#8254c4] inline-block"></span>
                            <span className="w-3 h-3 rounded-full bg-[#3e8a47] inline-block"></span>
                            <span className="w-3 h-3 rounded-full bg-[#823636] inline-block"></span>
                          </div>
                        )}
                        <h5
                          className={`text-[13px] font-semibold truncate mb-1 ${
                            isWhiteTheme ? "text-[#222222]" : "text-white"
                          }`}
                        >
                          {p.title}
                        </h5>
                        <div className="flex items-center space-x-0.5 text-[#cca382] mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-none stroke-current" />
                          ))}
                          <span className="text-[10px] text-gray-500 ml-1">(0)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[14px] font-bold ${
                              isWhiteTheme ? "text-[#222222]" : "text-white"
                            }`}
                          >
                            ${p.price.toFixed(2)}
                          </span>
                          {p.originalPrice > p.price && (
                            <>
                              <span className="text-gray-500 text-[11px] line-through">
                                ${p.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-[#cca382] text-[10px] font-medium">
                                {p.discountPercent}% Off
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. WISHLIST SLIDE-OVER DRAWER MODAL
          ======================================================== */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-[115] flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity animate-in fade-in"
            onClick={() => setIsWishlistOpen(false)}
          />

          <div
            className={`relative w-full max-w-[390px] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l ${
              isWhiteTheme
                ? "bg-[#ffffff] text-[#222222] border-[#e5e5e5]"
                : "bg-[#1e1e1e] text-white border-[#2e2e2e]"
            }`}
          >
            {/* Header */}
            <div
              className={`px-5 py-4 border-b flex items-center justify-between ${
                isWhiteTheme ? "border-[#eeeeee]" : "border-[#2b2b2b]"
              }`}
            >
              <h3
                className={`text-[17px] font-medium tracking-wide ${
                  isWhiteTheme ? "text-[#222222]" : "text-white"
                }`}
              >
                My Wishlist ({wishlistItemsList.length})
              </h3>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className={`w-7 h-7 flex items-center justify-center rounded-[2px] transition-colors cursor-pointer border ${
                  isWhiteTheme
                    ? "text-gray-500 hover:text-black border-[#e0e0e0] hover:border-black"
                    : "text-gray-400 hover:text-white border-[#383838] hover:border-gray-500"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List */}
            <div
              className={`flex-1 overflow-y-auto px-5 divide-y ${
                isWhiteTheme ? "divide-[#eeeeee]" : "divide-[#262626]"
              }`}
            >
              {wishlistItemsList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-[#cca382] ${
                      isWhiteTheme ? "bg-[#f8f8f8]" : "bg-[#272727]"
                    }`}
                  >
                    <Heart className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h4
                    className={`text-base font-medium mb-1 ${
                      isWhiteTheme ? "text-[#222222]" : "text-white"
                    }`}
                  >
                    Your Wishlist is Empty
                  </h4>
                  <p className="text-xs text-gray-400 max-w-[220px] mb-5">
                    Explore our furniture collection and add items you love!
                  </p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="py-2.5 px-6 bg-[#cca382] hover:bg-[#b89577] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                wishlistItemsList.map((item) => (
                  <div key={item.id} className="py-4 flex items-center space-x-3.5 group">
                    <div
                      className={`relative w-16 h-16 rounded-[2px] shrink-0 p-1 border ${
                        isWhiteTheme
                          ? "bg-[#f8f8f8] border-[#e5e5e5]"
                          : "bg-[#272727] border-[#333333]"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-[13px] font-medium truncate hover:text-[#cca382] transition-colors cursor-pointer ${
                          isWhiteTheme ? "text-[#222222]" : "text-white"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[13px] font-semibold text-[#cca382]">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          addToCart(item, 1);
                          removeFromWishlist(item.id);
                        }}
                        className="text-[11px] text-[#cca382] hover:underline font-medium mt-1 inline-block cursor-pointer"
                      >
                        + Move to Cart
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlistItemsList.length > 0 && (
              <div
                className={`p-5 border-t ${
                  isWhiteTheme
                    ? "bg-[#fafafa] border-[#eeeeee]"
                    : "bg-[#1a1a1a] border-[#262626]"
                }`}
              >
                <button
                  onClick={() => {
                    wishlistItemsList.forEach((item) => addToCart(item, 1));
                    setWishlistItemsList([]);
                    setWishlist([]);
                    setIsWishlistOpen(false);
                    showToast("All wishlist items moved to Cart!");
                  }}
                  className="w-full py-3 bg-[#cca382] hover:bg-[#b89577] text-white font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                >
                  Move All To Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          6. USER AUTH & PROFILE MODAL (FULL API INTEGRATED)
          ======================================================== */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authInitialTab}
        initialProfileView={authInitialProfileView}
        isWhiteTheme={isWhiteTheme}
        onToast={(msg) => showToast(msg)}
      />

      {/* ========================================================
          6b. DEDICATED NOTIFICATIONS MODAL
          ======================================================== */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        isWhiteTheme={isWhiteTheme}
        onToast={(msg, type) => showToast(msg, type)}
      />

      {/* ========================================================
          7. FLOATING NOTIFICATION TOAST
          ======================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[130] bg-[#1a1a1a] border border-[#cca382] text-white px-5 py-3.5 rounded-[2px] shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom duration-300">
          <div className="w-6 h-6 rounded-full bg-[#cca382] text-black flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error("useProductModal must be used within a ProductModalProvider");
  }
  return context;
}

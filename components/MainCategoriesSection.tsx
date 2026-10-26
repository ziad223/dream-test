"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  FolderTree,
  Package,
  X,
  Loader2,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { etrolleyApi } from "@/lib/api";
import { MainCategory, CategoryDetailResponse } from "@/lib/api/types";
import { useProductModal } from "./ProductModalContext";

interface MainCategoriesSectionProps {
  isWhiteTheme?: boolean;
}

export default function MainCategoriesSection({
  isWhiteTheme = false,
}: MainCategoriesSectionProps) {
  const { formatPrice, currentLanguage } = useProductModal();

  // Categories list and state
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and Pagination State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("alphabetical");
  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }>({
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
  });

  // Category Detail Modal ({{baseUrl}}/main-categories/{id})
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryDetail, setCategoryDetail] = useState<CategoryDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Active filter chip inside detail modal
  const [selectedFilterValues, setSelectedFilterValues] = useState<Record<string, number | string>>({});
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 450);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch categories when params change
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const response = await etrolleyApi.getMainCategories({
          search: debouncedSearch.trim() || undefined,
          sort_by: sortBy,
          per_page: perPage,
          page: currentPage,
        });

        if (isMounted && response?.data) {
          const list = response.data.data || [];
          setCategories(list);
          if (response.data.meta) {
            setMeta(response.data.meta);
          } else {
            setMeta({
              current_page: currentPage,
              last_page: Math.ceil(list.length / perPage) || 1,
              per_page: perPage,
              total: list.length,
            });
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error fetching main categories:", err);
          setError("Failed to load categories. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, sortBy, perPage, currentPage]);

  // Fetch Category Details when a category is clicked
  const handleOpenCategoryDetail = async (id: number) => {
    setSelectedCategoryId(id);
    setDetailLoading(true);
    setSelectedFilterValues({});
    setSelectedPriceRange(null);
    try {
      const res = await etrolleyApi.getCategoryById(id);
      if (res?.data) {
        setCategoryDetail(res.data);
      }
    } catch (err) {
      console.warn("Could not load category details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseCategoryDetail = () => {
    setSelectedCategoryId(null);
    setCategoryDetail(null);
  };

  // Helper to extract category name based on string/object format
  const getCategoryName = (category: MainCategory) => {
    if (typeof category.name === "string") return category.name;
    return category.name?.en || category.name?.ar || "Category";
  };

  return (
    <section
      id="main-categories-section"
      className={`py-12 px-4 sm:px-6 lg:px-8 border-t border-b transition-colors duration-300 ${
        isWhiteTheme
          ? "bg-[#ffffff] text-[#222222] border-[#e7e7e7]"
          : "bg-[#181615] text-[#ededed] border-[#262423]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cca382]" />
              <span className="text-[12px] font-bold tracking-widest uppercase text-[#cca382]">
                Main Categories
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Explore Featured Categories
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Browse all store categories with real-time search, sorting, and pagination
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div
            className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
              isWhiteTheme
                ? "bg-[#faf8f5] text-[#b3855c] border-[#e8d5c4]"
                : "bg-[#252220] text-[#d4996a] border-[#3d3632]"
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 mr-1.5 ml-1.5" />
            <span>
              {meta.total} Categories Found
            </span>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div
          className={`p-4 rounded-xl border mb-8 transition-colors ${
            isWhiteTheme
              ? "bg-[#fcfcfc] border-[#eaeaea] shadow-xs"
              : "bg-[#1f1d1b] border-[#2d2927] shadow-md"
          }`}
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* 1. Real-time Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search category (e.g. Men Clothing, Women Clothing, Kids...)"
                className={`w-full pl-9 pr-8 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#cca382] border ${
                  isWhiteTheme
                    ? "bg-white border-[#dcdcdc] text-black placeholder-gray-400"
                    : "bg-[#141211] border-[#363230] text-white placeholder-gray-500"
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 2. Sort Options */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center px-3 py-2 rounded-lg border text-sm ${
                  isWhiteTheme
                    ? "bg-white border-[#dcdcdc] text-gray-700"
                    : "bg-[#141211] border-[#363230] text-gray-300"
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 ml-1.5 text-[#cca382]" />
                <span className="text-xs text-gray-400 whitespace-nowrap ml-1 mr-1">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="alphabetical" className="bg-[#222] text-white">
                    Alphabetical (A - Z)
                  </option>
                  <option value="sort" className="bg-[#222] text-white">
                    Priority Order (Sort)
                  </option>
                  <option value="total_products" className="bg-[#222] text-white">
                    Most Products
                  </option>
                </select>
              </div>

              {/* 3. Items Per Page */}
              <div
                className={`flex items-center px-3 py-2 rounded-lg border text-sm ${
                  isWhiteTheme
                    ? "bg-white border-[#dcdcdc] text-gray-700"
                    : "bg-[#141211] border-[#363230] text-gray-300"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 ml-1.5 text-[#cca382]" />
                <span className="text-xs text-gray-400 whitespace-nowrap ml-1 mr-1">
                  Per page:
                </span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value={5} className="bg-[#222] text-white">5</option>
                  <option value={10} className="bg-[#222] text-white">10</option>
                  <option value={20} className="bg-[#222] text-white">20</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-9 h-9 text-[#cca382] animate-spin" />
            <p className="text-sm text-gray-400 font-medium">
              Loading categories...
            </p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-rose-500 font-medium">{error}</p>
            <button
              onClick={() => setCurrentPage(1)}
              className="mt-3 px-4 py-2 bg-[#cca382] hover:bg-[#b88f6e] text-white rounded-md text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center border rounded-xl border-dashed border-[#3d3835]">
            <FolderTree className="w-12 h-12 text-gray-500 mx-auto mb-3 stroke-[1.3]" />
            <p className="text-base font-semibold text-gray-300">
              No categories found
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search terms or filters
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-[#cca382] text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {categories.map((cat) => {
              const displayName = getCategoryName(cat);
              const directCount = cat.direct_products_count ?? 0;
              const subCount = cat.sub_products_count ?? 0;
              const totalCount = cat.total_products_count ?? directCount + subCount;
              const subCatsCount = cat.children_count ?? 0;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleOpenCategoryDetail(cat.id)}
                  className={`group relative rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
                    isWhiteTheme
                      ? "bg-white border-[#eaeaea] hover:border-[#cca382]"
                      : "bg-[#201d1b] border-[#2d2825] hover:border-[#cca382] hover:bg-[#25221f]"
                  }`}
                >
                  {/* Top: Icon & Sort Order */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center p-2.5 transition-colors ${
                        isWhiteTheme
                          ? "bg-[#faf6f2] group-hover:bg-[#f3ebe1]"
                          : "bg-[#181615] group-hover:bg-[#2d2723]"
                      }`}
                    >
                      {cat.icon ? (
                        <Image
                          src={cat.icon}
                          alt={displayName}
                          width={44}
                          height={44}
                          className="object-contain"
                        />
                      ) : (
                        <Layers className="w-6 h-6 text-[#cca382]" />
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isWhiteTheme
                          ? "bg-gray-100 text-gray-600 border-gray-200"
                          : "bg-[#181615] text-gray-400 border-[#302c29]"
                      }`}
                    >
                      #{cat.sort || cat.id}
                    </span>
                  </div>

                  {/* Center: Title & Description */}
                  <div>
                    <h3
                      className={`text-base font-bold tracking-tight mb-2 transition-colors group-hover:text-[#cca382] line-clamp-1 ${
                        isWhiteTheme ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {displayName}
                    </h3>

                    {/* Product stats */}
                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Package className="w-3 h-3 mr-1.5 text-[#cca382]" />
                          Direct:
                        </span>
                        <span className="font-semibold text-gray-300">{directCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <FolderTree className="w-3 h-3 mr-1.5 text-gray-500" />
                          Sub-categories:
                        </span>
                        <span className="font-semibold text-gray-300">{subCatsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Total Badge & View Details Link */}
                  <div className="mt-4 pt-3.5 border-t border-dashed border-[#34302d] flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#cca382]">
                      {totalCount} Total Products
                    </span>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white flex items-center">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Filters
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {meta.last_page > 1 && (
          <div className="mt-8 pt-6 border-t border-[#2e2a27] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-400">
              Showing page {meta.current_page} of {meta.last_page} ({meta.total} total categories)
            </span>

            <div className="flex items-center space-x-1.5">
              <button
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center transition-colors ${
                  currentPage <= 1
                    ? "opacity-40 cursor-not-allowed border-[#333]"
                    : "hover:bg-[#cca382] hover:text-white cursor-pointer border-[#444]"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === pg
                      ? "bg-[#cca382] text-white"
                      : isWhiteTheme
                      ? "hover:bg-gray-200 text-gray-700"
                      : "hover:bg-[#2d2825] text-gray-300"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage >= meta.last_page || loading}
                onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center transition-colors ${
                  currentPage >= meta.last_page
                    ? "opacity-40 cursor-not-allowed border-[#333]"
                    : "hover:bg-[#cca382] hover:text-white cursor-pointer border-[#444]"
                }`}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          Category Detail & Filters Modal ({{baseUrl}}/main-categories/{id})
          ======================================================== */}
      {selectedCategoryId && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={handleCloseCategoryDetail}
          />

          <div
            className={`relative w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col z-10 border overflow-hidden animate-in zoom-in-95 duration-200 ${
              isWhiteTheme
                ? "bg-white text-gray-900 border-gray-200"
                : "bg-[#1c1a18] text-[#f2f2f2] border-[#36322f]"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-5 border-b flex items-center justify-between ${
                isWhiteTheme ? "border-gray-200 bg-gray-50" : "border-[#2b2724] bg-[#221f1d]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#cca382]/20 flex items-center justify-center text-[#cca382]">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {categoryDetail?.name || "Category Filters"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Details and filtering options for category #{selectedCategoryId}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseCategoryDetail}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500/20 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {detailLoading ? (
                <div className="py-14 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#cca382] animate-spin" />
                  <p className="text-xs text-gray-400">
                    Loading filters...
                  </p>
                </div>
              ) : categoryDetail ? (
                <>
                  {/* 1. Price Ranges Section */}
                  {categoryDetail.prices && categoryDetail.prices.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#cca382] mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cca382] mr-2" />
                        Price Ranges
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categoryDetail.prices.map((p) => {
                          const isSelected = selectedPriceRange === p.value;
                          const label =
                            p.text && p.price
                              ? `${p.text} ${formatPrice(p.price)}`
                              : p.minPrice !== undefined && p.maxPrice !== undefined
                              ? `${formatPrice(p.minPrice)} - ${formatPrice(p.maxPrice)}`
                              : p.value;
                          return (
                            <button
                              key={p.id}
                              onClick={() => setSelectedPriceRange(isSelected ? null : p.value)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-[#cca382] text-white border-[#cca382]"
                                  : isWhiteTheme
                                  ? "bg-gray-100 text-gray-700 border-gray-200 hover:border-[#cca382]"
                                  : "bg-[#25221f] text-gray-300 border-[#38332f] hover:border-[#cca382]"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3 h-3" />}
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Dynamic Attribute Filters (Colors, Sizes, Options) */}
                  {categoryDetail.filters && categoryDetail.filters.length > 0 && (
                    <div className="space-y-5">
                      {categoryDetail.filters.map((filter) => (
                        <div key={filter.id} className="border-t border-[#2e2a27] pt-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#cca382] mb-2.5 flex items-center justify-between">
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#cca382] mr-2" />
                              {filter.name}
                            </span>
                            {filter.price ? (
                              <span className="text-[11px] text-gray-400 font-normal">
                                +{formatPrice(filter.price)}
                              </span>
                            ) : null}
                          </h4>

                          {filter.values && filter.values.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {filter.values.map((v) => {
                                const isSelected = selectedFilterValues[filter.id] === v.id;
                                return (
                                  <button
                                    key={v.id}
                                    onClick={() =>
                                      setSelectedFilterValues((prev) => ({
                                        ...prev,
                                        [filter.id]: isSelected ? "" : v.id,
                                      }))
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                                      isSelected
                                        ? "bg-[#cca382] text-white border-[#cca382]"
                                        : isWhiteTheme
                                        ? "bg-gray-100 text-gray-700 border-gray-200 hover:border-[#cca382]"
                                        : "bg-[#25221f] text-gray-300 border-[#38332f] hover:border-[#cca382]"
                                    }`}
                                  >
                                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                    <span>{v.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic">
                              No predefined values
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. Subcategories list if present */}
                  {categoryDetail.sub_categories && categoryDetail.sub_categories.length > 0 && (
                    <div className="border-t border-[#2e2a27] pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#cca382] mb-2.5 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cca382] mr-2" />
                        Sub-categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categoryDetail.sub_categories.map((sub: any, idx: number) => (
                          <span
                            key={sub.id || idx}
                            className={`px-3 py-1 rounded-md text-xs font-medium border ${
                              isWhiteTheme
                                ? "bg-gray-100 border-gray-200 text-gray-800"
                                : "bg-[#25221f] border-[#38332f] text-gray-300"
                            }`}
                          >
                            {typeof sub.name === "string" ? sub.name : sub.name?.en || sub.name?.ar || "Subcategory"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-10 text-center text-gray-500 text-sm">
                  No additional details found
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 border-t flex items-center justify-between ${
                isWhiteTheme ? "border-gray-200 bg-gray-50" : "border-[#2b2724] bg-[#221f1d]"
              }`}
            >
              <button
                onClick={() => {
                  setSelectedFilterValues({});
                  setSelectedPriceRange(null);
                }}
                className="text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Reset Filters
              </button>

              <button
                onClick={handleCloseCategoryDetail}
                className="px-5 py-2 rounded-lg bg-[#cca382] hover:bg-[#b88f6e] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

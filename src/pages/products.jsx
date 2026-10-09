import React, { useEffect, useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import FilterSection from "../components/FilterSection";
import ProductCart from "../components/ProductCart";
import Pagination from "../components/Pagination";
import loadingVideo from "../assets/loading4.webm";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { LuSlidersHorizontal } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";

export default function Products() {
  const { data, loading, error, fetchAllProducts } = useData();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // FIX: stable fetchAllProducts (useCallback) means this only runs once on mount
  useEffect(() => {
    fetchAllProducts();
    window.scrollTo(0, 0);
  }, [fetchAllProducts]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
  }, [search, category, brand, priceRange]);

  const handleCategoryChange = (item) => setCategory(item);
  const handleBrandChange = (value) => setBrand(value);

  const pageHandler = (selectedPage) => {
    setPage(selectedPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 4000]);
  };

  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      return (
        item.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || item.category === category) &&
        (brand === "All" || item.brand === brand) &&
        item.price >= priceRange[0] &&
        item.price <= priceRange[1]
      );
    });
  }, [data, search, category, brand, priceRange]);

  const dynamicPage = Math.ceil((filteredData?.length || 0) / 8);
  const paginatedProducts = filteredData?.slice((page - 1) * 8, page * 8);

  const isFiltered =
    search !== "" ||
    category !== "All" ||
    brand !== "All" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 4000;

  const activeChips = [
    ...(search ? [{ label: `"${search}"`, clear: () => setSearch("") }] : []),
    ...(category !== "All" ? [{ label: category, clear: () => setCategory("All") }] : []),
    ...(brand !== "All" ? [{ label: brand, clear: () => setBrand("All") }] : []),
    ...(priceRange[0] !== 0 || priceRange[1] !== 4000
      ? [{ label: `$${priceRange[0]} – $${priceRange[1]}`, clear: () => setPriceRange([0, 4000]) }]
      : []),
  ];

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] gap-4">
        <video autoPlay loop muted className="w-36">
          <source src={loadingVideo} type="video/webm" />
        </video>
        <p className="text-gray-400 text-sm font-medium animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] gap-4 text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <MdErrorOutline className="text-red-500 text-3xl" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Failed to load products</h3>
          <p className="text-gray-400 text-sm mt-1">{error}</p>
        </div>
        <button
          onClick={fetchAllProducts}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              All Products
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              Showing{" "}
              <span className="font-semibold text-gray-600">
                {filteredData?.length ?? 0}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-600">{data.length}</span>{" "}
              products
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <IoCloseCircle className="text-lg" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 font-medium">Active:</span>
            {activeChips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full"
              >
                {chip.label}
                <button
                  onClick={chip.clear}
                  className="hover:text-red-800 cursor-pointer transition-colors"
                >
                  <IoCloseCircle className="text-sm" />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs text-gray-400 hover:text-red-500 font-semibold underline underline-offset-2 cursor-pointer transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-16">

        {/* Mobile Filter Toggle */}
        <div className="flex lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-red-300 hover:text-red-500 transition-all shadow-sm cursor-pointer"
          >
            <LuSlidersHorizontal />
            Filters
            {isFiltered && (
              <span className="bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              sidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <LuSlidersHorizontal className="text-gray-400 text-base" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                    Filters
                  </h2>
                </div>
                {isFiltered && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer bg-red-50 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-all"
                  >
                    Reset all
                  </button>
                )}
              </div>

              <FilterSection
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                brand={brand}
                setBrand={setBrand}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                handleCategoryChange={handleCategoryChange}
                handleBrandChange={handleBrandChange}
              />
            </div>
          </aside>

          {/* ── Products Grid ── */}
          <div className="flex-1 min-w-0">
            {filteredData?.length > 0 ? (
              <div className="flex flex-col items-center gap-10">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
                  {paginatedProducts?.map((product, index) => (
                    <div
                      key={product.id || product._id}
                      className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-gray-200 transition-all duration-300 ease-out cursor-pointer"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {/* Red accent bar slides in on hover */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-rose-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <ProductCart product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination — only show if more than 1 page */}
                {dynamicPage > 1 && (
                  <Pagination
                    pageHandler={pageHandler}
                    page={page}
                    dynamicPage={dynamicPage}
                  />
                )}
              </div>
            ) : (
              /* ── No Results ── */
              <div className="flex flex-col items-center justify-center min-h-[420px] gap-6 text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center">
                    <span className="text-5xl">🔍</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-base">
                    ✕
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">
                    No products found
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                    We couldn't match any products to your current filters.
                    Try broadening your search.
                  </p>
                </div>
                {activeChips.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                    {activeChips.map((chip, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {chip.label}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleResetFilters}
                  className="px-7 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-100 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

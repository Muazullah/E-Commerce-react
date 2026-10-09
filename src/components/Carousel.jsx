import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Category from './Category';

const CARDS_PER_PAGE = 4;

function Carousel() {
  const { data, fetchAllProducts } = useData();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [page, setPage]       = useState(0);
  const [wished, setWished]   = useState({});
  const [sliderIdx, setSliderIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null); // 'left' | 'right'
  const [isAnimating, setIsAnimating] = useState(false);

  // touch / drag
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const totalPages = Math.ceil((data?.length || 0) / CARDS_PER_PAGE);
  const sliderTotal = data?.length || 0;

  /* ── navigation helpers ── */
  const goSlider = useCallback((dir) => {
    if (isAnimating) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setSliderIdx((i) =>
        dir === 'right'
          ? (i + 1) % sliderTotal
          : (i - 1 + sliderTotal) % sliderTotal
      );
      setIsAnimating(false);
      setAnimDir(null);
    }, 280);
  }, [isAnimating, sliderTotal]);

  const sliderPrev = useCallback(() => goSlider('left'),  [goSlider]);
  const sliderNext = useCallback(() => goSlider('right'), [goSlider]);

  const goPrev = useCallback(() => setPage((p) => (p - 1 + totalPages) % totalPages), [totalPages]);
  const goNext = useCallback(() => setPage((p) => (p + 1) % totalPages),               [totalPages]);

  useEffect(() => { fetchAllProducts(); }, []);

  /* auto-advance */
  useEffect(() => {
    if (!data?.length) return;
    const t = setInterval(() => goSlider('right'), 3800);
    return () => clearInterval(t);
  }, [data, goSlider]);

  useEffect(() => {
    if (!data?.length) return;
    const t = setInterval(() => setPage((p) => (p + 1) % totalPages), 4200);
    return () => clearInterval(t);
  }, [data, totalPages]);

  /* touch handlers */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 40 && dy < 60) {
      dx < 0 ? sliderNext() : sliderPrev();
    }
    touchStartX.current = null;
  };

  const toggleWish = (id, e) => {
    e.stopPropagation();
    setWished((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── loading ── */
  if (!data || data.length === 0) {
    return (
      <section className="px-4 sm:px-6 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 py-20 text-gray-400 text-sm">
          <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading products…
        </div>
      </section>
    );
  }

  const start       = page * CARDS_PER_PAGE;
  const visibleItems = data.slice(start, start + CARDS_PER_PAGE);
  const sliderItem  = data[sliderIdx];

  /* ── shared card ── */
  const ProductCard = ({ item, large = false }) => (
    <div
      onClick={() => navigate(`/products/${item.id}`)}
      className={`bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer
                  hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1
                  transition-all duration-300 group flex ${large ? 'flex-row h-full' : 'flex-col'}`}
    >
      {/* Image */}
      <div className={`relative bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center flex-shrink-0
                       ${large ? 'w-2/5 min-h-[260px]' : 'h-44 w-full border-b border-gray-100'}`}>
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = 'https://placehold.co/300'; }}
        />

        {/* Badge */}
        {item.discountPercentage >= 5 ? (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide shadow-sm">
            -{Math.round(item.discountPercentage)}%
          </span>
        ) : item.stock < 20 ? (
          <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide shadow-sm">
            LOW STOCK
          </span>
        ) : null}

        {/* Wishlist */}
        <button
          onClick={(e) => toggleWish(item.id, e)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center
                      transition-all duration-200 shadow-sm
                      ${wished[item.id]
                        ? 'bg-red-50 border-red-300 text-red-500 scale-110'
                        : 'bg-white border-gray-200 text-gray-300 hover:text-red-400 hover:border-red-300 hover:scale-110'}`}
          aria-label={wished[item.id] ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={13} className={wished[item.id] ? 'fill-red-500' : ''} />
        </button>
      </div>

      {/* Body */}
      <div className={`flex flex-col justify-between ${large ? 'flex-1 p-7' : 'p-4'}`}>
        <div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">
            {item.category}
          </p>
          <h3 className={`font-semibold text-gray-900 leading-snug mb-3
                          ${large ? 'text-xl line-clamp-2' : 'text-sm line-clamp-2 min-h-[40px]'}`}>
            {item.title}
          </h3>

          {large && (
            <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
              {item.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  className={s <= Math.round(item.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                />
              ))}
            </div>
            <span className={`text-gray-400 font-medium ${large ? 'text-sm' : 'text-[11px]'}`}>
              {item.rating}
            </span>
            {large && (
              <span className="text-gray-300 text-xs ml-1">({item.stock} in stock)</span>
            )}
          </div>
        </div>

        {/* Price + CTA */}
        <div className={`${large ? 'flex items-center justify-between mt-4' : ''}`}>
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`font-bold text-gray-900 ${large ? 'text-3xl' : 'text-base'}`}>
              ${item.price}
            </span>
            {item.discountPercentage >= 5 && (
              <span className={`text-gray-400 line-through font-normal ${large ? 'text-base' : 'text-xs'}`}>
                ${Math.round(item.price / (1 - item.discountPercentage / 100))}
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); addToCart(item); }}
            className={`flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700
                        text-white font-bold rounded-xl active:scale-95 transition-all duration-150
                        ${large
                          ? 'px-8 py-3.5 text-sm mb-3'
                          : 'w-full py-2.5 text-xs mb-0'}`}
          >
            <ShoppingCart size={large ? 16 : 13} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  /* slide animation classes */
  const slideClass = isAnimating
    ? animDir === 'right'
      ? 'opacity-0 -translate-x-6 scale-[0.97]'
      : 'opacity-0 translate-x-6 scale-[0.97]'
    : 'opacity-100 translate-x-0 scale-100';

  return (
    <section className="px-4 sm:px-6 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">
              Handpicked for you
            </p>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Featured <span className="text-indigo-600">Products</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs md:text-sm font-semibold text-indigo-600 hover:text-indigo-800
                       flex items-center gap-1 transition-colors group"
          >
            View all
            <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════
            MOBILE + TABLET  (< lg)  — full-bleed slider
            ══════════════════════════════════════════════ */}
        <div className="block lg:hidden">
          <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

            {/* Card with animation */}
            <div
              className={`transition-all duration-[280ms] ease-out ${slideClass}`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {/* Mobile (< md): stacked layout */}
              <div className="block md:hidden p-4">
                <ProductCard item={sliderItem} large={false} />
              </div>

              {/* Tablet (md–lg): horizontal "hero" layout */}
              <div className="hidden md:block p-5" style={{ minHeight: '300px' }}>
                <ProductCard item={sliderItem} large={true} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
              <div
                key={sliderIdx}
                className="h-full bg-indigo-500 rounded-full"
                style={{
                  animation: 'progress 3.8s linear forwards',
                }}
              />
            </div>

            {/* Left / Right arrows — floating */}
            <button
              onClick={sliderPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2
                         w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200
                         flex items-center justify-center shadow-md
                         text-gray-500 hover:text-indigo-600 hover:border-indigo-300
                         active:scale-90 transition-all duration-150 z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={sliderNext}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200
                         flex items-center justify-center shadow-md
                         text-gray-500 hover:text-indigo-600 hover:border-indigo-300
                         active:scale-90 transition-all duration-150 z-10"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Dot indicators below card */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {data.map((_, i) => (
              <button
                key={i}
                onClick={() => { setSliderIdx(i); }}
                aria-label={`Item ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300
                  ${i === sliderIdx ? 'w-6 bg-indigo-600' : 'w-1.5 bg-gray-300 hover:bg-indigo-300'}`}
              />
            ))}
          </div>

          {/* Counter */}
          <p className="text-center text-[11px] text-gray-400 font-medium mt-2">
            {sliderIdx + 1} <span className="text-gray-300">/</span> {sliderTotal}
          </p>
        </div>

        {/* ══════════════════════════════════════════════
            DESKTOP (lg+) — 4-col paged grid
            ══════════════════════════════════════════════ */}
        <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl p-8 pb-5 shadow-sm">
          <div className="grid grid-cols-4 gap-5">
            {visibleItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

          {/* Desktop pagination */}
          <div className="flex items-center justify-between mt-7 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Page ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300
                    ${i === page ? 'w-6 bg-indigo-600' : 'w-1.5 bg-gray-300 hover:bg-indigo-300'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-gray-400 font-medium">{page + 1} / {totalPages}</span>
              <button
                onClick={goPrev}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
                           text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50
                           active:scale-95 transition-all duration-150"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={goNext}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
                           text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50
                           active:scale-95 transition-all duration-150"
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <Category />
      </div>

      {/* keyframe for progress bar */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}

export default Carousel;

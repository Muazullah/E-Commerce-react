import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Emoji icons keyed to DummyJSON category slugs
const ICONS = {
  smartphones:          '📱',
  laptops:              '💻',
  fragrances:           '🌸',
  skincare:             '🧴',
  groceries:            '🛒',
  'home-decoration':    '🛋️',
  furniture:            '🪑',
  tops:                 '👕',
  'womens-dresses':     '👗',
  'womens-shoes':       '👠',
  'mens-shirts':        '👔',
  'mens-shoes':         '👟',
  'mens-watches':       '⌚',
  'womens-watches':     '⌚',
  'womens-bags':        '👜',
  'womens-jewellery':   '💍',
  sunglasses:           '🕶️',
  automotive:           '🚗',
  motorcycle:           '🏍️',
  lighting:             '💡',
  tablets:              '📲',
  'mobile-accessories': '🎧',
  'sports-accessories': '🏋️',
  beauty:               '💄',
  'kitchen-accessories':'🍳',
  vehicle:              '🚙',
};

// "womens-dresses" → "Womens Dresses"
function formatLabel(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function Category({ activeCategory, onCategoryChange }) {
  const { data } = useData();
  const navigate = useNavigate();
  const railRef = useRef(null);

  // Derive unique categories directly from data — same logic as your original
  const categories = ['all', ...new Set(data?.map((p) => p.category).filter(Boolean))];

  const scroll = (dir) => {
    railRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  const handleClick = (cat) => {
    if (onCategoryChange) {
      // controlled mode — parent handles filtering
      onCategoryChange(cat);
    } else {
      // standalone mode — navigate like your original
      navigate(cat === 'all' ? '/products' : `/category/${cat}`);
    }
  };

  return (
    <div className="bg-[#101829]">
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Top row: label + scroll arrows */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Browse categories
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-7 h-7 rounded-lg flex items-center justify-center
                         border border-white/10 bg-white/[0.04] text-white/40
                         hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400
                         transition-all duration-150"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-7 h-7 rounded-lg flex items-center justify-center
                         border border-white/10 bg-white/[0.04] text-white/40
                         hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400
                         transition-all duration-150"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Scrollable pill rail */}
        <div className="relative">
          <div
            ref={railRef}
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => {
              const isActive = cat === (activeCategory ?? 'all');
              const icon  = ICONS[cat] ?? '📦';
              const label = cat === 'all' ? 'All' : formatLabel(cat);

              return (
                <button
                  key={cat}
                  onClick={() => handleClick(cat)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full flex-shrink-0
                              text-xs font-semibold whitespace-nowrap transition-all duration-200
                              ${isActive
                                ? 'bg-indigo-600 border border-indigo-600 text-white'
                                : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white/90'
                              }`}
                >
                  <span className="text-sm leading-none">{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right-side fade so pills disappear cleanly */}
          <div
            className="absolute top-0 right-0 h-full w-12 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #101829, transparent)' }}
            aria-hidden="true"
          />
        </div>

      </div>
    </div>
  );
}

export default Category;

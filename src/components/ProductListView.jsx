import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowRight, Star } from 'lucide-react';

const ProductListView = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const hasDiscount = product.discountPercentage >= 1;
  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - product.discountPercentage / 100))
    : null;
  const isLowStock  = product.stock > 0 && product.stock < 15;
  const isOutOfStock = product.stock === 0;

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white border border-gray-100 rounded-2xl cursor-pointer group
                 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5
                 transition-all duration-200
                 p-3 sm:p-4 md:p-5 lg:p-6"
    >
      <div className="flex gap-3 sm:gap-4 md:gap-6">

        {/* ── Thumbnail ── */}
        <div className="flex-shrink-0
                        w-24 h-24
                        sm:w-32 sm:h-32
                        md:w-44 md:h-44
                        lg:w-52 lg:h-52
                        rounded-xl bg-gradient-to-br from-gray-50 to-indigo-50/30
                        border border-gray-100 overflow-hidden
                        flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain p-2 md:p-3
                       transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://placehold.co/200'; }}
          />
        </div>

        {/* ── Body ── */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-1.5 md:gap-2">

          {/* Category */}
          <p className="text-[9px] sm:text-[10px] md:text-xs
                        font-bold text-indigo-500 uppercase tracking-widest">
            {product.category}
          </p>

          {/* Title */}
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl
                         font-bold text-gray-900 leading-snug line-clamp-2">
            {product.title}
          </h2>

          {/* Description — only md+ */}
          {product.description && (
            <p className="hidden md:block lg:line-clamp-2
                          text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-1">
              {product.description}
            </p>
          )}

          {/* Price row */}
          <div className="flex items-center flex-wrap gap-1.5 md:gap-2 mt-0.5">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl
                             font-extrabold text-gray-900 tracking-tight">
              ${product.price}
            </span>

            {hasDiscount && (
              <>
                <span className="text-xs md:text-sm text-gray-400 line-through font-normal">
                  ${originalPrice}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-red-600
                                 bg-red-50 border border-red-100
                                 px-2 py-0.5 rounded-full">
                  -{Math.round(product.discountPercentage)}% off
                </span>
              </>
            )}

            {/* Star rating */}
            <span className="flex items-center gap-1
                             bg-amber-50 border border-amber-100
                             rounded-full px-2 py-0.5">
              <span className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    className={s <= Math.round(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-gray-200 text-gray-200'}
                  />
                ))}
              </span>
              <span className="text-[11px] md:text-xs font-bold text-amber-800">
                {product.rating}
              </span>
            </span>
          </div>

          {/* Stock + delivery */}
          <div className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 leading-relaxed">
            {isOutOfStock ? (
              <span className="font-semibold text-red-500">Out of stock</span>
            ) : isLowStock ? (
              <span className="font-semibold text-amber-600">
                Only {product.stock} left
              </span>
            ) : (
              <span className="font-semibold text-emerald-600">In stock</span>
            )}
            {' · '}FREE delivery{' '}
            <span className="font-semibold text-gray-800">Fri, 18 Apr</span>
          </div>

          {/* Actions */}
          <div
            className="flex items-center flex-wrap gap-2 mt-1 md:mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className="inline-flex items-center gap-1.5
                         bg-indigo-600 hover:bg-indigo-700
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         text-white font-bold rounded-xl
                         active:scale-95 transition-all duration-150
                         text-[11px] px-3 py-1.5
                         sm:text-xs sm:px-4 sm:py-2
                         md:text-sm md:px-5 md:py-2.5"
            >
              <ShoppingCart size={12} className="sm:hidden" />
              <ShoppingCart size={14} className="hidden sm:block md:hidden" />
              <ShoppingCart size={15} className="hidden md:block" />
              Add to Cart
            </button>

            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="inline-flex items-center gap-1
                         border border-gray-200 bg-transparent
                         hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                         text-gray-500 font-semibold rounded-xl
                         transition-all duration-150
                         text-[11px] px-3 py-1.5
                         sm:text-xs sm:px-3 sm:py-2
                         md:text-sm md:px-4 md:py-2.5"
            >
              View details
              <ArrowRight size={11} className="sm:hidden" />
              <ArrowRight size={13} className="hidden sm:block md:hidden" />
              <ArrowRight size={14} className="hidden md:block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListView;

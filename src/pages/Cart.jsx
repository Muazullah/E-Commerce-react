import React from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/empty-cart.png";
import {
  Trash2, Truck, ShoppingBag, FileText,
  Tag, Lock, MapPin, Save
} from "lucide-react";

const Cart = ({ location, getLocation }) => {
  const { cartItem, updateQuantity, deleteItem } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const totalPrice = cartItem.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = cartItem.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {cartItem.length > 0 ? (
        <div className="max-w-6xl mx-auto
                        px-4 sm:px-6 md:px-8 lg:px-10
                        py-6 sm:py-8 md:py-10
                        pb-16">

          {/* ── Header ── */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl
                             font-extrabold text-gray-900 tracking-tight">
                My Cart
              </h1>
              <span className="text-xs sm:text-sm font-semibold
                               bg-indigo-50 text-indigo-600
                               border border-indigo-100
                               px-3 py-1 rounded-full">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Review your items before checkout
            </p>
          </div>

          {/* ── Main grid: sidebar at md+ ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

            {/* LEFT: Cart Items + Delivery */}
            <div className="md:col-span-2 space-y-3 md:space-y-4">

              {/* Cart Items */}
              {cartItem.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-2xl
                             p-3 sm:p-4 md:p-5
                             shadow-sm hover:shadow-md hover:border-indigo-100
                             transition-all duration-200"
                >
                  {/* ── Mobile (< sm): stacked layout ── */}
                  <div className="flex gap-3 sm:gap-4">

                    {/* Thumbnail */}
                    <div className="flex-shrink-0
                                    w-16 h-16
                                    sm:w-20 sm:h-20
                                    md:w-24 md:h-24
                                    rounded-xl overflow-hidden bg-gray-50
                                    border border-gray-100">
                      <img
                        src={item.thumbnail || item.images?.[0] || item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-1.5
                                   transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/80x80?text=IMG";
                        }}
                      />
                    </div>

                    {/* Info + controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <p className="text-xs sm:text-sm md:text-base
                                    font-semibold text-gray-800
                                    line-clamp-2 leading-snug">
                        {item.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-indigo-600 font-bold
                                      text-sm sm:text-base md:text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-[11px] sm:text-xs">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Qty + Delete — always in a row, sized for thumb */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center border border-gray-200
                                        rounded-xl overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, "decrease")}
                            className="w-8 h-8 sm:w-9 sm:h-9
                                       text-base sm:text-lg font-bold text-gray-500
                                       hover:bg-indigo-50 hover:text-indigo-500
                                       transition-colors cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-8 h-8 sm:w-9 sm:h-9
                                           flex items-center justify-center
                                           text-xs sm:text-sm font-bold text-gray-800
                                           border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, "increase")}
                            className="w-8 h-8 sm:w-9 sm:h-9
                                       text-base sm:text-lg font-bold text-gray-500
                                       hover:bg-indigo-50 hover:text-indigo-500
                                       transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="w-8 h-8 sm:w-9 sm:h-9
                                     flex items-center justify-center
                                     rounded-xl border border-gray-200
                                     text-red-400 hover:bg-red-50 hover:border-red-200
                                     transition-all cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Info Card */}
              <div className="bg-white border border-gray-100 rounded-2xl
                              p-4 sm:p-5 md:p-6 shadow-sm mt-2">
                <h2 className="text-sm sm:text-base font-bold text-gray-800
                               mb-4 md:mb-5 flex items-center gap-2">
                  <Truck size={18} className="text-indigo-500" />
                  Delivery Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-semibold
                                      text-gray-500 uppercase tracking-wide mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      defaultValue={user?.fullName || ""}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                 bg-gray-50 text-sm focus:outline-none
                                 focus:border-indigo-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-semibold
                                      text-gray-500 uppercase tracking-wide mb-1.5">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Street address"
                      defaultValue={location?.county || ""}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                 bg-gray-50 text-sm focus:outline-none
                                 focus:border-indigo-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold
                                      text-gray-500 uppercase tracking-wide mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="State"
                      defaultValue={location?.state || ""}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                 bg-gray-50 text-sm focus:outline-none
                                 focus:border-indigo-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold
                                      text-gray-500 uppercase tracking-wide mb-1.5">
                      Postcode
                    </label>
                    <input
                      type="text"
                      placeholder="Postcode"
                      defaultValue={location?.postcode || ""}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                 bg-gray-50 text-sm focus:outline-none
                                 focus:border-indigo-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold
                                      text-gray-500 uppercase tracking-wide mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Country"
                      defaultValue={location?.country || ""}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                 bg-gray-50 text-sm focus:outline-none
                                 focus:border-indigo-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold
                                      text-gray-500 uppercase tracking-wide mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 000 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                                 bg-gray-50 text-sm focus:outline-none
                                 focus:border-indigo-400 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-5">
                  <button className="flex-1 flex items-center justify-center gap-2
                                     bg-indigo-600 hover:bg-indigo-700 text-white
                                     font-semibold py-2.5 rounded-xl text-sm
                                     transition-colors cursor-pointer active:scale-95">
                    <Save size={14} />
                    Save Address
                  </button>
                  <button
                    onClick={getLocation}
                    className="flex-1 flex items-center justify-center gap-2
                               border border-gray-200 hover:border-indigo-300
                               hover:bg-indigo-50 hover:text-indigo-600
                               text-gray-600 font-semibold py-2.5 rounded-xl text-sm
                               transition-all cursor-pointer"
                  >
                    <MapPin size={14} />
                    Detect My Location
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary — sidebar at md+, stacked on mobile */}
            <div className="md:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl
                              p-4 sm:p-5 md:p-6 shadow-sm
                              md:sticky md:top-6">
                <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-4 md:mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                      <FileText size={14} className="text-gray-400" />
                      Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                      <Truck size={14} className="text-gray-400" />
                      Delivery
                    </span>
                    <span>
                      <span className="line-through text-gray-400 text-xs mr-1">$25</span>
                      <span className="text-emerald-600 font-semibold text-xs sm:text-sm">FREE</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                      <ShoppingBag size={14} className="text-gray-400" />
                      Handling
                    </span>
                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">$5.00</span>
                  </div>
                </div>

                <hr className="my-4 border-gray-100" />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm sm:text-base">
                    Grand Total
                  </span>
                  <span className="font-extrabold text-indigo-600
                                   text-lg sm:text-xl">
                    ${(totalPrice + 5).toFixed(2)}
                  </span>
                </div>

                {/* Promo */}
                <div className="mt-4 md:mt-5 bg-gray-50 border border-dashed
                                border-gray-200 rounded-xl p-3 sm:p-4">
                  <p className="text-[11px] sm:text-xs font-semibold
                                text-gray-500 mb-2 flex items-center gap-1.5">
                    <Tag size={12} className="text-gray-400" />
                    Promo Code
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200
                                 bg-white text-xs sm:text-sm focus:outline-none
                                 focus:border-indigo-400 transition-colors"
                    />
                    <button className="px-3 sm:px-4 py-2 rounded-lg border border-gray-200
                                       text-xs sm:text-sm font-semibold
                                       hover:border-indigo-300 hover:text-indigo-600
                                       hover:bg-indigo-50 transition-all cursor-pointer">
                      Apply
                    </button>
                  </div>
                </div>

                <button className="w-full mt-4 md:mt-5
                                   bg-indigo-600 hover:bg-indigo-700
                                   active:scale-95 text-white font-bold
                                   py-2.5 sm:py-3 rounded-xl
                                   text-sm tracking-wide
                                   transition-all cursor-pointer">
                  Proceed to Checkout →
                </button>

                <p className="text-center text-[11px] text-gray-400 mt-3
                               flex items-center justify-center gap-1.5">
                  <Lock size={11} />
                  SSL encrypted secure checkout
                </p>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center
                        min-h-[70vh] gap-4 sm:gap-5
                        px-6 text-center">
          <img
            src={emptyCart}
            alt="Empty cart"
            className="w-36 sm:w-44 md:w-56 opacity-80"
          />
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl
                           font-extrabold text-gray-800 tracking-tight">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mt-2 text-xs sm:text-sm">
              Looks like you haven't added anything yet.
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
                       px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl
                       text-sm transition-colors cursor-pointer active:scale-95"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../assets/Loading4.webm";
import Breadcrums from "../components/Breadcrums";
import { IoCartOutline } from "react-icons/io5";
import { useCart } from "../context/CartContext";

const SingleProduct = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // FIX: controlled state
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();

  const getSingleProduct = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/${params.id}`);
      setProduct(res.data);
      setActiveImg(0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [params.id]);

  // FIX: correct original price — was adding discount, should divide
  const originalPrice = product
    ? Math.round(product.price / (1 - product.discountPercentage / 100))
    : 0;

  // FIX: prioritize images array, fall back to thumbnail
  const images = product?.images?.length
    ? product.images
    : product?.thumbnail
    ? [product.thumbnail]
    : [];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const inStock = product?.stock > 0;

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <video muted autoPlay loop className="w-48">
          <source src={Loading} type="video/webm" />
        </video>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <Breadcrums title={product.title} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">

          {/* Image Gallery */}
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center shadow-sm">
              <img
                src={images[activeImg]}
                alt={product.title}
                className="w-full h-full object-contain p-6"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x400?text=No+Image";
                }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition-all duration-150 hover:scale-105 ${
                      i === activeImg
                        ? "border-red-500 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-5">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.brand && (
                <span className="text-xs font-semibold bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
              )}
              {product.category && (
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize">
                  {product.category}
                </span>
              )}
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  inStock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-lg leading-none">
                  {"★".repeat(Math.round(product.rating))}
                  <span className="text-gray-300">
                    {"★".repeat(5 - Math.round(product.rating))}
                  </span>
                </span>
                <span className="text-sm text-gray-500">
                  {product.rating.toFixed(1)} rating
                </span>
              </div>
            )}

            {/* Price — FIX: correct original price formula */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-red-500">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-lg line-through text-gray-400">
                ${originalPrice}
              </span>
              <span className="text-xs font-bold bg-red-500 text-white px-3 py-1 rounded-full">
                {product.discountPercentage}% OFF
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {product.description}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="flex items-end gap-4 pt-2">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Quantity
                </p>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    className="w-10 h-11 text-xl font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  {/* FIX: controlled input with onChange */}
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(product.stock, Number(e.target.value)))
                      )
                    }
                    className="w-11 h-11 text-center text-sm font-bold text-gray-800 border-x border-gray-200 focus:outline-none bg-white"
                  />
                  <button
                    className="w-10 h-11 text-xl font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ${
                  inStock
                    ? "bg-red-500 hover:bg-red-600 active:scale-95 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <IoCartOutline className="text-xl" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>

            {/* Extra Info */}
            {(product.warrantyInformation ||
              product.shippingInformation ||
              product.returnPolicy) && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 text-sm text-gray-500">
                {product.warrantyInformation && (
                  <p>🛡 {product.warrantyInformation}</p>
                )}
                {product.shippingInformation && (
                  <p>🚚 {product.shippingInformation}</p>
                )}
                {product.returnPolicy && (
                  <p>↩ {product.returnPolicy}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;

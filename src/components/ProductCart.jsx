import React from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {

  const navigate = useNavigate();
  const {addToCart, cartItem} = useCart();
  

  return (

    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className='border relative border-gray-100 rounded-2xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all p-2 h-max'
    >

      <img
        src={product.images?.[0]}
        alt={product.title}
        className='w-full h-48 object-contain bg-gray-100'
      />

      <h1 className='line-clamp-2 p-1 font-semibold'>
        {product.title}
      </h1>

      <p className='my-1 text-lg text-gray-800 font-bold'>
        ${product.price}
      </p>

      <button
        className='bg-red-500 px-3 py-2 text-lg rounded-md text-white w-full cursor-pointer flex gap-1 items-center justify-center font-semibold'
        onClick={() => addToCart(product)}
      >
        <IoCartOutline className='w-6 h-6 '  />
        Add to Cart
      </button>

    </div>
  );
}
"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
}

export default function ProductInfo({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  // Selection State
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isWishlist, setIsWishlist] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    
    addToCart({ 
      ...product, 
      selectedSize, 
      selectedColor,
      quantity: 1, 
    });
  };

  return (
    <div className="flex flex-col h-full pt-2 md:pt-4">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 mb-6">
        <span className="text-sm text-pink-600 font-bold uppercase tracking-widest">
          {product.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-2 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mt-3">
            <p className="text-2xl text-gray-900 font-semibold">${product.price}</p>
            {/* Fake Rating for style */}
            <div className="flex items-center text-yellow-400 text-sm">
                ★★★★☆ <span className="text-gray-400 ml-1">(42 reviews)</span>
            </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <p className="text-gray-600 leading-relaxed text-base">
          {product.description}
        </p>
      </div>

      <div className="space-y-8">
        {/* Color Selector */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Select Color</h3>
                <span className="text-xs text-gray-500 capitalize">{selectedColor || "None selected"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    selectedColor === color 
                      ? "ring-2 ring-offset-2 ring-black" 
                      : "hover:ring-1 hover:ring-offset-1 hover:ring-gray-300"
                  }`}
                  aria-label={`Select color ${color}`}
                >
                  <span 
                    className="w-full h-full rounded-full border border-gray-100 shadow-sm"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  {selectedColor === color && (
                    <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Select Size</h3>
                <button type="button" className="text-xs text-pink-600 hover:underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 ${
                    selectedSize === size
                      ? "border-black bg-black text-white shadow-lg"
                      : "border-gray-100 text-gray-700 hover:border-black hover:text-black bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
            onClick={handleAddToCart}
            type="button"
            disabled={!selectedSize || !selectedColor}
            className={`flex-1 py-4 text-white font-bold text-lg rounded-full transition-all duration-300 transform active:scale-[0.98] shadow-xl ${
                !selectedSize || !selectedColor
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 hover:shadow-2xl"
            }`}
            >
            {!selectedSize || !selectedColor ? "Select Options" : "Add to Cart"}
            </button>

            {/* Wishlist Button - Fixed Accessibility */}
            <button 
                type="button"
                aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"} // ✅ Added this line
                onClick={() => setIsWishlist(!isWishlist)}
                className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-colors ${
                    isWishlist ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500"
                }`}
            >
                <svg className="w-6 h-6" fill={isWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>
        
        {/* Extra Info */}
        <div className="flex gap-6 text-xs text-gray-500 uppercase tracking-widest justify-center">
            <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Free Shipping</span>
            <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Free Returns</span>
        </div>
      </div>
    </div>
  );
}
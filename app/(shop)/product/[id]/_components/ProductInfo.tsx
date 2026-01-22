"use client";

import { useState } from "react";
import AddToCartButton from "@/components/product/AddToCartButton"; // Keep existing path
import { useCart } from "@/store/useCart";       // 👈 Import Cart Store
import { useRouter } from "next/navigation";     // 👈 Import Router

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[]; // 👈 Added images to interface (required for cart)
  sizes?: string[];
  colors?: string[];
}

export default function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  // Hooks for Buy Now logic
  const { addToCart } = useCart();
  const router = useRouter();

  // 👇 Handle Buy Now Logic
  const handleBuyNow = () => {
    // 1. Add item to global cart state
    addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images || [],
        selectedSize,
        selectedColor,
        quantity: 1
    });

    // 2. Redirect immediately to Cart Page
    router.push("/cart");
  };

  return (
    <div className="flex flex-col space-y-8">
      
      {/* 1. Header & Price */}
      <div className="space-y-4 border-b border-gray-100 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">
            In Stock
          </span>
        </div>
      </div>

      {/* 2. Description */}
      <div className="prose prose-sm text-gray-600 leading-relaxed">
        <p>{product.description}</p>
      </div>

      {/* 3. Selectors (Size/Color) */}
      <div className="space-y-6">
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              Select Size
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] h-10 px-4 border rounded-md text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-600 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
        
        {/* Add to Cart Button (Keeps user on page) */}
        <div className="flex-1">
          <AddToCartButton 
             product={{ 
               ...product, 
               selectedSize, 
               selectedColor 
             }} 
          />
        </div>

        {/* Buy Now Button (Redirects to Cart) */}
        <button 
          className="flex-1 px-8 py-4 rounded-full text-lg font-bold border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
          onClick={handleBuyNow} 
        >
          Buy Now
        </button>
      </div>

      {/* 5. Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 text-center">
        <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
           <span className="text-xl">🚚</span>
           <span className="text-xs font-medium text-gray-600">Free Shipping</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
           <span className="text-xl">🔒</span>
           <span className="text-xs font-medium text-gray-600">Secure Payment</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
           <span className="text-xl">↩️</span>
           <span className="text-xs font-medium text-gray-600">Free Returns</span>
        </div>
      </div>

    </div>
  );
}
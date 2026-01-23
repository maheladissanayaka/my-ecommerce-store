"use client";

import { useState } from "react";
import AddToCartButton from "@/components/product/AddToCartButton"; 
import { useCart } from "@/store/useCart";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
}

export default function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [isFavorite, setIsFavorite] = useState(false); // State for Wishlist

  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    // Validation: Ensure size is selected if sizes exist
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size first.");
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      selectedSize,
      selectedColor,
      quantity: 1
    });

    // 👇 Redirect DIRECTLY to Checkout (skipping cart page)
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col space-y-6">
      
      {/* 1. Header, Price, Reviews & Favorite */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          
          {/* Favorite Heart Button */}
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-full hover:bg-gray-50 transition-colors"
            title="Add to Wishlist"
          >
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               viewBox="0 0 24 24" 
               fill={isFavorite ? "red" : "none"} 
               stroke={isFavorite ? "red" : "currentColor"} 
               className="w-7 h-7"
             >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
             </svg>
          </button>
        </div>

        {/* 5-Star Rating Display */}
        <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-400">
               {[1, 2, 3, 4, 5].map((star) => (
                 <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 </svg>
               ))}
            </div>
            <span className="text-sm text-gray-500 underline cursor-pointer hover:text-black">
              (124 Reviews)
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">1.2k Sold</span>
        </div>

        <div className="mt-4 flex items-end gap-3">
          <span className="text-3xl font-bold text-red-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-lg text-gray-400 line-through mb-1">
            ${(product.price * 1.2).toFixed(2)}
          </span>
          <span className="mb-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold uppercase rounded">
             -20% Off
          </span>
        </div>
      </div>

      {/* 2. Selectors */}
      <div className="space-y-6">
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-bold text-gray-900">Size</h3>
               <button className="text-xs text-blue-600 underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3.5rem] h-10 px-2 border rounded-lg text-sm font-semibold transition-all ${
                    selectedSize === size
                      ? "border-black bg-black text-white shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-black bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Buttons */}
      <div className="flex gap-3 pt-4">
        <div className="w-1/2">
           <AddToCartButton 
              product={{ 
                ...product, 
                selectedSize, 
                selectedColor 
              }} 
           />
        </div>
        <button 
          className="w-1/2 px-4 py-3 rounded-full text-base font-bold bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.98] transition-all shadow-lg"
          onClick={handleBuyNow} 
        >
          Buy Now
        </button>
      </div>

      {/* 4. Trust Badges */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-3">
           <span className="text-lg">🛡️</span>
           <span><strong>Buyer Protection:</strong> Get full refund if the item is not as described.</span>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-lg">🚚</span>
           <span><strong>Free Shipping:</strong> Delivery by Nov 25 - Dec 05</span>
        </div>
      </div>

      {/* 5. Description - Clearly Displayed */}
      <div className="pt-6 border-t border-gray-100">
         <h3 className="font-bold text-lg mb-3">Description</h3>
         <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-line">
           {product.description}
         </div>
      </div>

    </div>
  );
}
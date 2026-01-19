"use client";

import Image from "next/image";
import { useCart } from "@/store/useCart"; // Assuming you updated your store import path
import { CartItem as CartItemType } from "@/store/useCart";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { removeFromCart } = useCart();

  return (
    <div className="group relative flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image - Portrait Aspect Ratio for Clothes */}
      <div className="relative w-24 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
        <Image
          src={item.images?.[0] || "/placeholder.jpg"} // Fallback image
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 line-clamp-2 pr-4 text-base md:text-lg">
              {item.name}
            </h3>
            <p className="font-bold text-gray-900 shrink-0">
              ${item.price}
            </p>
          </div>
          
          {/* Size & Color Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {item.selectedSize && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Size: {item.selectedSize}
              </span>
            )}
            {item.selectedColor && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Color: 
                <span 
                  className="w-3 h-3 rounded-full border border-gray-300" 
                  style={{ backgroundColor: item.selectedColor }}
                />
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <p className="text-sm text-gray-500 font-medium">
            Qty: {item.quantity}
          </p>
          
          {/* Stylish Remove Button */}
          <button
            onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 -mr-2"
            aria-label="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
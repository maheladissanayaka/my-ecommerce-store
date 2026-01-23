"use client";

import Image from "next/image";
import { useCart, CartItem as CartItemType } from "@/store/useCart";

interface Props {
  item: CartItemType;
  isSelected: boolean;
  onToggle: () => void;
}

export default function CartItem({ item, isSelected, onToggle }: Props) {
  const { removeFromCart, updateQuantity } = useCart();

  // Handle quantity decrease
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity - 1);
    } else {
      // Alert user before removing the item
      if (confirm("Are you sure you want to remove this item?")) {
        removeFromCart(item._id, item.selectedSize, item.selectedColor);
      }
    }
  };

  // Handle quantity increase
  const handleIncrease = () => {
    updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity + 1);
  };

  return (
    <div className={`group relative flex gap-4 p-4 border rounded-2xl bg-white shadow-sm transition-all duration-300 ${isSelected ? 'border-black ring-1 ring-black' : 'border-gray-100'}`}>
      
      {/* Selection Checkbox */}
      <div className="flex items-center">
         <input 
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            className="w-5 h-5 accent-black cursor-pointer rounded border-gray-300"
         />
      </div>

      {/* Product Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
        <Image
          src={item.images?.[0] || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base leading-snug">
              {item.name}
            </h3>
             
             {/* Delete Button */}
             <button
              onClick={() => {
                  if(confirm("Remove this item?")) {
                      removeFromCart(item._id, item.selectedSize, item.selectedColor);
                  }
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <div className="mt-1 text-xs text-gray-500">
             {item.selectedSize && <span className="mr-3">Size: {item.selectedSize}</span>}
             {item.selectedColor && <span>Color: {item.selectedColor}</span>}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <p className="font-bold text-lg text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
             <button 
                onClick={handleDecrease}
                className="px-3 py-1 hover:bg-gray-200 text-gray-600 rounded-l-lg"
             >-</button>
             <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
             <button 
                onClick={handleIncrease}
                className="px-3 py-1 hover:bg-gray-200 text-gray-600 rounded-r-lg"
             >+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useCart, CartItem as CartItemType } from "@/store/useCart";
import { useEffect, useState, useRef, useCallback } from "react";
import EmptyCart from "./_components/EmptyCart";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  
  // State to track selected items
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  
  // Ref to track if we have already initialized the default selection
  const isInitialized = useRef(false);

  // Helper to generate unique ID for items
  const getItemKey = useCallback((item: CartItemType) => {
    return `${item._id}-${item.selectedSize}-${item.selectedColor}`;
  }, []);

  // 👇 FIX 1: Wrap setMounted in setTimeout to avoid the "synchronous update" error
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 👇 FIX 2: Auto-select items when cart loads (also wrapped to be safe)
  useEffect(() => {
    if (mounted && cart.length > 0 && !isInitialized.current) {
        const allKeys = new Set(cart.map((item) => getItemKey(item)));
        
        setTimeout(() => {
           setSelectedKeys(allKeys);
           isInitialized.current = true;
        }, 0);
    }
  }, [mounted, cart, getItemKey]);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  const cartItems = cart || [];

  // Toggle Single Item
  const toggleItem = (key: string) => {
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(key)) {
        newSelected.delete(key);
    } else {
        newSelected.add(key);
    }
    setSelectedKeys(newSelected);
  };

  // Toggle "Select All"
  const toggleAll = () => {
    if (selectedKeys.size === cartItems.length) {
        setSelectedKeys(new Set()); // Deselect all
    } else {
        const allKeys = new Set(cartItems.map(getItemKey));
        setSelectedKeys(allKeys); // Select all
    }
  };

  // Check if all are selected
  const isAllSelected = cartItems.length > 0 && selectedKeys.size === cartItems.length;

  // Calculate Subtotal for SELECTED items only
  const selectedTotal = cartItems
    .filter(item => selectedKeys.has(getItemKey(item)))
    .reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
          Shopping Cart ({cartItems.length})
        </h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: Cart Items */}
            <div className="flex-1 space-y-4">
              
              {/* Select All / Delete All Bar */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div 
                      onClick={toggleAll}
                      className="cursor-pointer flex items-center gap-3"
                    >
                      <input 
                          type="checkbox" 
                          checked={isAllSelected}
                          readOnly // Controlled by onClick on parent
                          className="w-5 h-5 accent-black cursor-pointer"
                      />
                      <span className="font-medium text-gray-700 select-none">Select All ({cartItems.length})</span>
                    </div>
                 </div>
                 <button
                    onClick={clearCart}
                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                    Delete All
                </button>
              </div>
              
              {/* Cart Items List */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-6">
                    {cartItems.map((item) => {
                        const key = getItemKey(item);
                        return (
                            <CartItem 
                                key={key} 
                                item={item} 
                                isSelected={selectedKeys.has(key)}
                                onToggle={() => toggleItem(key)}
                            />
                        );
                    })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Summary */}
            <div className="w-full lg:w-[380px] h-fit">
              <CartSummary 
                subtotal={selectedTotal} 
                selectedCount={selectedKeys.size} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
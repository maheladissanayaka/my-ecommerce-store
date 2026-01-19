"use client";

import { useCart } from "@/store/useCart";
import { useEffect, useState } from "react";
import EmptyCart from "./_components/EmptyCart";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";

export default function CartPage() {
  const { items, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Prevent hydration errors by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const applyCoupon = async () => {
    if (!couponCode) return;
    // Mock coupon logic for demonstration
    if (couponCode.toUpperCase() === "FASHION10") {
        setDiscount(10);
        alert("Coupon applied: 10% OFF");
    } else {
        alert("Invalid coupon code");
        setDiscount(0);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-white" />; // Clean loading state

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          Shopping Bag <span className="text-lg font-normal text-gray-500 ml-2">({items.length} items)</span>
        </h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Items List (Span 7 or 8) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-6">
                    {items.map((item) => (
                        <CartItem key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} item={item} />
                    ))}
                </div>
                
                <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100">
                    <button
                        onClick={clearCart}
                        className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-colors"
                    >
                        Clear Shopping Bag
                    </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Coupon + Summary (Span 5 or 4) */}
            <div className="lg:col-span-4 space-y-6 h-fit">
              
              {/* Coupon Input */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold mb-3 text-gray-900">Have a promo code?</h3>
                  <div className="flex gap-2">
                      <input 
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Promo Code"
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black uppercase tracking-wider"
                      />
                      <button 
                          onClick={applyCoupon}
                          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
                      >
                          Apply
                      </button>
                  </div>
              </div>

              {/* Summary Component */}
              <CartSummary discount={discount} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
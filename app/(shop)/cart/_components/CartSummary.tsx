"use client";

import { useCart } from "@/store/useCart"; // Matches new store
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartSummary({ discount = 0 }: { discount?: number }) {
  // 👇 FIX 1: Use correct names from store
  const { cart, totalAmount } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 👇 FIX 2: Use totalAmount() from store directly
  const subtotal = totalAmount();
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = () => {
    setLoading(true);
    // 👇 FIX 3: Redirect to the Checkout Page (to enter address) instead of API directly
    router.push("/checkout"); 
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
      
      {/* Payment Method Note */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wider">Payment Method</h3>
        <div className="p-4 rounded-xl border border-black bg-gray-50 flex items-center">
            <span className="w-5 h-5 bg-black rounded-full mr-3 flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>
            <span className="font-medium text-gray-900">Cash on Delivery</span>
        </div>
      </div>

      {/* Calculations */}
      <div className="space-y-3 mb-8 pb-8 border-b border-dashed border-gray-200">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
            <div className="flex justify-between text-pink-600 font-medium">
              <span>Discount ({discount}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-medium text-gray-900">Total</span>
          <span className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || cart.length === 0}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {loading ? (
            <>Processing...</>
        ) : (
            <>
                Proceed to Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
        )}
      </button>
    </div>
  );
}
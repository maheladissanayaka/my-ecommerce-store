"use client";

import { useCart } from "@/store/useCart";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartSummary({ discount = 0 }: { discount?: number }) {
  const { items, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const router = useRouter();

  const subtotal = getCartTotal ? getCartTotal() : items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Simulate API call or replace with real one
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, totalAmount: total, paymentMethod }), 
      });
      
      const data = await res.json();
      
      if (res.ok) { // Check res.ok instead of data.url for robustness
         clearCart();
         if (data.url) window.location.href = data.url;
         else router.push("/success?orderId=" + (data.orderId || "123"));
      } else {
        alert("Checkout failed. Please try again."); // Simple error handling
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
      
      {/* Payment Method */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wider">Payment Method</h3>
        <div className="space-y-3">
            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === "COD" ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-300"
            }`}>
                <input 
                    type="radio" 
                    name="payment" 
                    value="COD" 
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-black"
                />
                <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
            </label>
            
            <label className="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                <input type="radio" name="payment" disabled className="w-5 h-5" />
                <span className="ml-3 font-medium text-gray-500">Credit Card (Coming Soon)</span>
            </label>
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
        disabled={loading}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {loading ? (
            <>Processing...</>
        ) : (
            <>
                Checkout Now 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
        )}
      </button>
    </div>
  );
}
"use client";

import { useCart } from "@/store/useCart";
import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Clear the cart once the user lands here
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {orderId && (
          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-6">
            Order ID: <span className="font-mono text-black">#{orderId.slice(-6)}</span>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/orders" 
            className="block w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            View My Orders
          </Link>
          <Link 
            href="/" 
            className="block w-full text-gray-600 py-3 font-medium hover:text-black transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
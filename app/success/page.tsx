"use client";

import { useCart } from "@/store/useCart";
import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Truck, ShoppingBag, ArrowRight } from "lucide-react";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Clear the cart once the user lands here
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-gray-100 relative overflow-hidden">
      
      {/* Top Decorative Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600" />
      
      {/* Success Animation Icon */}
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-in zoom-in duration-500">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
            <Check className="w-8 h-8 text-white" strokeWidth={4} />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
        Order Confirmed!
      </h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Thank you for choosing <strong>Lumina Fashion</strong>. Your style upgrade is officially in the works!
      </p>

      {/* Order Details Card */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-left space-y-4">
        
        {/* Payment Method Info */}
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border border-gray-200 shadow-sm">
                <Truck className="w-5 h-5 text-pink-600" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</p>
                <p className="font-bold text-gray-900">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Please pay upon arrival.</p>
            </div>
        </div>

        {/* Divider */}
        {orderId && <div className="h-px bg-gray-200 w-full" />}

        {/* Order ID Info */}
        {orderId && (
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full border border-gray-200 shadow-sm">
                    <ShoppingBag className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Reference</p>
                    <p className="font-mono text-sm font-bold text-gray-900 tracking-wide">
                        #{orderId.slice(-6).toUpperCase()}
                    </p>
                </div>
            </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <Link
          href="/orders"
          className="group block w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          Track My Order
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/"
          className="block w-full text-gray-500 py-2 font-semibold hover:text-pink-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// Main Page Wrapper
export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-200/20 rounded-full blur-3xl" />
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            <p className="text-pink-600 font-medium animate-pulse">Confirming order...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
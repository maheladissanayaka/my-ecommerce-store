"use client";

import Link from "next/link";

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-red-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-8">
          {/* 👇 FIXED: Used &apos; instead of ' */}
          We couldn&apos;t process your payment. Please try again or use a different payment method.
        </p>
        <div className="space-y-3">
          <Link href="/checkout" className="block w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
            Try Again
          </Link>
          <Link href="/cart" className="block w-full text-gray-500 font-medium hover:text-black transition">
            Return to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
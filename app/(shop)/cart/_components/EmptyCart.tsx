"use client";

import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🛍️</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Your bag is empty
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Looks like you haven't added any fashion pieces to your cart yet.
      </p>
      <Link 
        href="/" 
        className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
      >
        Start Shopping
      </Link>
    </div>
  );
}
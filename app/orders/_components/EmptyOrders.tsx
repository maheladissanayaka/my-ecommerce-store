"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
      <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <ShoppingBag className="w-10 h-10 text-pink-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        It looks like you haven't discovered our latest fashion collection yet.
      </p>
      <Link
        href="/"
        className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
      >
        Start Shopping
      </Link>
    </div>
  );
}
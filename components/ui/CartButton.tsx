"use client";

import { useCart } from "@/store/useCart"; 
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartButton() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 👇 FIX: Use setTimeout to avoid the "synchronous update" error
    const timer = setTimeout(() => {
        setMounted(true);
    }, 100);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  // Calculate total safely
  const totalItems = (cart || []).reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) {
    // Return a placeholder to prevent layout shift
    return <div className="w-10 h-10" />;
  }

  return (
    <Link
      href="/cart"
      className="group relative flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-3 md:py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
      aria-label={`View Cart, ${totalItems} items`}
    >
      {/* Shopping Bag Icon */}
      <svg 
        className="w-6 h-6 text-gray-900 group-hover:text-black transition-colors" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>

      {/* Desktop Text (Hidden on Mobile) */}
      <span className="hidden md:block ml-2 font-medium text-sm text-gray-900">
        Bag
      </span>

      {/* Notification Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 md:top-0 md:right-0 md:relative md:ml-1 flex h-5 w-5 md:h-5 md:w-5 items-center justify-center rounded-full bg-pink-600 text-[10px] md:text-xs font-bold text-white shadow-sm ring-2 ring-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
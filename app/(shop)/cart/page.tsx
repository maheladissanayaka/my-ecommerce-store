"use client";

import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import EmptyCart from "./_components/EmptyCart";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";

export default function CartPage() {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        // RESPONSIVE GRID: 1 column on mobile, 3 columns on large screens
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* LEFT COLUMN: Items List */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}

            <button
              onClick={clearCart}
              className="text-gray-500 text-sm hover:text-black underline mt-4"
            >
              Clear Cart
            </button>
          </div>

          {/* RIGHT COLUMN: Summary (Stacks below on mobile) */}
          <div className="h-fit">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
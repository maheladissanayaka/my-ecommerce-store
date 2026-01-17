"use client";

import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartSummary() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    // 1. Force user to login if they aren't
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // 2. Send order to backend
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: getTotalPrice(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Order Placed Successfully!");
        clearCart(); // Empty the cart
        router.push("/"); // Go back home (or to an order success page)
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border w-full lg:sticky lg:top-4">
      <h2 className="text-lg md:text-xl font-bold mb-4">Order Summary</h2>

      <div className="flex justify-between mb-2 text-sm md:text-base text-gray-600">
        <span>Subtotal</span>
        <span>${getTotalPrice().toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-4 text-sm md:text-base text-gray-600">
        <span>Shipping</span>
        <span>Free</span>
      </div>

      <div className="border-t pt-4 flex justify-between font-bold text-lg md:text-xl mb-6">
        <span>Total</span>
        <span>${getTotalPrice().toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-black text-white py-3 md:py-4 rounded-lg font-medium hover:bg-gray-800 transition active:scale-95 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
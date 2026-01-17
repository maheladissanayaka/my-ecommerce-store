"use client";

import { useCart } from "@/store/useCart"; // Assuming you use Zustand
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, clearCart } = useCart(); // Assuming you have clearCart
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Calculate Total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: total,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/" className="text-blue-600 hover:underline">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
             <div key={item._id} className="flex gap-4 border p-4 rounded-lg bg-white shadow-sm">
               <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                 <Image src={item.image} alt={item.name} fill className="object-cover" />
               </div>
               <div>
                 <h3 className="font-semibold">{item.name}</h3>
                 <p className="text-gray-500">${item.price} x {item.quantity}</p>
               </div>
             </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="border-t my-4"></div>
          <div className="flex justify-between mb-6 text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Pay with Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
}
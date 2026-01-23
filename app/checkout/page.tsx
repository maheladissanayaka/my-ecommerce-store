"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CheckoutForm from "./_components/CheckoutForm";
import { useCart } from "@/store/useCart";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  if (status === "loading") return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  if (cart.length === 0) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
              <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">Continue Shopping</button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>
        <CheckoutForm user={session?.user} />
      </div>
    </div>
  );
}
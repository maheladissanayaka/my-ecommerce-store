"use client";

import { useCart } from "@/store/useCart"; // Updated import to match previous context
import { useState } from "react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  const handleAdd = () => {
    setStatus("adding");
    
    // Simulate a brief loading effect for better UX
    setTimeout(() => {
      addToCart({ ...product, quantity: 1 }); // Ensure default quantity
      setStatus("added");
      
      // Reset back to idle after 2 seconds
      setTimeout(() => setStatus("idle"), 2000);
    }, 500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={status !== "idle"}
      className={`
        w-full md:w-auto px-8 py-4 rounded-full text-lg font-bold text-white transition-all duration-300 transform active:scale-95 shadow-lg
        ${status === "idle" ? "bg-black hover:bg-gray-900" : ""}
        ${status === "adding" ? "bg-gray-400 cursor-wait" : ""}
        ${status === "added" ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {status === "idle" && (
            <>
                <span>Add to Cart</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </>
        )}
        
        {status === "adding" && <span>Adding...</span>}
        
        {status === "added" && (
            <>
                <span>Added</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </>
        )}
      </div>
    </button>
  );
}
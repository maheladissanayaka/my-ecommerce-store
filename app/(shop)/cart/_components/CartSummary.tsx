"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

// 👇 Accept props for dynamic calculation
interface Props {
  subtotal: number;
  selectedCount: number;
}

export default function CartSummary({ subtotal, selectedCount }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    if (selectedCount === 0) {
        alert("Please select at least one item to checkout.");
        return;
    }
    setLoading(true);
    router.push("/checkout");
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Summary</h2>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600 text-sm">
            <span>Subtotal ({selectedCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
        </div>
        
        <div className="h-px bg-gray-100 my-2" />
        
        <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            {/* 👇 Display the passed subtotal */}
            <span className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading || selectedCount === 0}
        className="w-full bg-black text-white py-3.5 rounded-full font-bold text-lg hover:bg-gray-800 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mb-8"
      >
        {loading ? "Processing..." : `Checkout (${selectedCount})`}
      </button>

      {/* Pay With Icons */}
      <div className="mb-6">
        <h3 className="font-bold text-sm text-gray-900 mb-3">Pay with</h3>
        <div className="flex gap-2 flex-wrap">
            <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
               <span className="text-[10px] font-bold text-blue-800 italic">VISA</span>
            </div>
            <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
               <div className="flex -space-x-1">
                 <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
               </div>
            </div>
            <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
               <span className="text-[8px] font-bold text-blue-500">AMEX</span>
            </div>
             <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
               <span className="text-[8px] font-bold text-green-600">JCB</span>
            </div>
        </div>
      </div>

      {/* Buyer Protection */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-sm text-gray-900">Buyer protection</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Get a full refund if the item is not as described or not delivered.
                </p>
            </div>
        </div>
      </div>

    </div>
  );
}
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyOrders() {
  return (
    <div className="text-center py-20 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        {/* 👇 FIXED: Escaped the apostrophe in 'haven't' */}
        Looks like you haven&apos;t placed any orders yet. Start shopping to fill your wardrobe!
      </p>
      <Link 
        href="/" 
        className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
      >
        Start Shopping
      </Link>
    </div>
  );
}
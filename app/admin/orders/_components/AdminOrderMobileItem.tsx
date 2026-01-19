"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderProps {
  order: {
    _id: string;
    user: { name: string; email: string };
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
  };
}

export default function AdminOrderMobileItem({ order }: OrderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    await fetch(`/api/admin/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "paid": return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped": return "bg-purple-50 text-purple-700 border-purple-200";
      case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
      {/* Header: ID and Date */}
      <div className="flex justify-between items-start border-b border-gray-50 pb-3">
        <div>
            <span className="font-mono text-xs text-gray-400">ORDER ID</span>
            <p className="font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
        </div>
        <div className="text-right">
            <span className="font-mono text-xs text-gray-400">DATE</span>
            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Body: Customer & Total */}
      <div className="flex justify-between items-center">
        <div>
            <p className="font-bold text-gray-900 text-lg">{order.user?.name || "Guest"}</p>
            <p className="text-xs text-gray-400">{order.user?.email}</p>
            <p className="text-xs text-gray-500 mt-1">{order.items.length} Items purchased</p>
        </div>
        <div className="text-right">
            <p className="text-2xl font-bold text-pink-600">${order.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Footer: Status Control */}
      <div className={`p-3 rounded-xl border flex items-center justify-between ${getStatusColor(status)}`}>
        <span className="text-xs font-bold uppercase tracking-wide">Status</span>
        
        {/* FIX IS HERE: Added aria-label */}
        <select
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
            aria-label={`Change status for order ${order._id}`} 
            className="bg-transparent font-bold text-sm outline-none cursor-pointer text-right w-full"
        >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
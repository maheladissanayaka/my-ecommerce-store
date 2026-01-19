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

export default function AdminOrderRow({ order }: OrderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "paid": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-pink-50/30 transition-colors group">
      <td className="p-4 font-mono text-xs text-gray-500">
        #{order._id.slice(-6).toUpperCase()}
      </td>
      <td className="p-4">
        <div className="font-bold text-gray-900">{order.user?.name || "Guest Checkout"}</div>
        <div className="text-gray-400 text-xs">{order.user?.email}</div>
      </td>
      <td className="p-4 text-sm text-gray-600">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4 font-bold text-gray-900">
        ${order.totalAmount.toFixed(2)}
      </td>
      <td className="p-4">
        <div className="relative inline-block">
            <select
            aria-label={`Change status for order ${order._id}`}
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
            className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-500 transition-all uppercase tracking-wide ${getStatusColor(status)}`}
            >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            </select>
            {/* Custom Arrow Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                {loading ? (
                    <div className="h-3 w-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                )}
            </div>
        </div>
      </td>
      <td className="p-4 text-gray-500 text-sm">
        <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
        </span>
      </td>
    </tr>
  );
}
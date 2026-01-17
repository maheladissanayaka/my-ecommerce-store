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
        router.refresh(); // Refresh data to confirm sync
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  // Color helper for badges
  const getStatusColor = (s: string) => {
    switch (s) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "paid": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50 text-sm">
      <td className="p-4 font-mono">#{order._id.slice(-6)}</td>
      <td className="p-4">
        <div className="font-medium text-gray-900">{order.user?.name || "Guest"}</div>
        <div className="text-gray-500 text-xs">{order.user?.email}</div>
      </td>
      <td className="p-4">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4 font-medium">${order.totalAmount.toFixed(2)}</td>
      <td className="p-4">
        {/* FIX IS HERE: Added aria-label */}
        <select
          aria-label={`Change status for order ${order._id}`}
          value={status}
          onChange={handleStatusChange}
          disabled={loading}
          className={`px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer ${getStatusColor(status)}`}
        >
          <option value="pending">PENDING</option>
          <option value="paid">PAID</option>
          <option value="shipped">SHIPPED</option>
          <option value="delivered">DELIVERED</option>
        </select>
        {loading && <span className="ml-2 text-xs text-gray-400">...</span>}
      </td>
      <td className="p-4 text-gray-500">
        {order.items.length} items
      </td>
    </tr>
  );
}
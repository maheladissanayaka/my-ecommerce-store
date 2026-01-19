import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "../_components/AdminSidebar";
import AdminOrderRow from "./_components/AdminOrderRow";
import AdminOrderMobileItem from "./_components/AdminOrderMobileItem";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // Required for populate to work

async function getOrders() {
  await connectDB();
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const orders = await getOrders();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50/50 overflow-hidden font-sans">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h1>
            <p className="text-sm text-gray-500 mt-1">Track and update customer orders.</p>
        </div>

        {orders.length === 0 ? (
             <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                <p className="text-gray-500">Wait for your first sale to appear here.</p>
            </div>
        ) : (
            <>
                {/* 1. DESKTOP VIEW: Table */}
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: any) => (
                                <AdminOrderRow key={order._id} order={order} />
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. MOBILE VIEW: Stacked Cards */}
                <div className="md:hidden flex flex-col gap-4">
                    {orders.map((order: any) => (
                        <AdminOrderMobileItem key={order._id} order={order} />
                    ))}
                </div>
            </>
        )}
      </main>
    </div>
  );
}
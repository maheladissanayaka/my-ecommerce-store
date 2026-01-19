import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Ensure you import default or { Product } correctly based on your file
import AdminSidebar from "./_components/AdminSidebar";
import StatsCard from "./_components/StatsCard";
import DashboardHeader from "./_components/DashboardHeader";

async function getDashboardStats() {
  await connectDB();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();
  
  const revenueResult = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  return {
    products: productsCount,
    orders: ordersCount,
    revenue: totalRevenue,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50/50 overflow-hidden font-sans">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <DashboardHeader title="Dashboard Overview" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard 
                title="Total Revenue" 
                value={`$${stats.revenue.toFixed(2)}`} 
                trend="12.5%"
                color="pink"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatsCard 
                title="Total Orders" 
                value={stats.orders} 
                trend="8.2%"
                color="purple"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            />
            <StatsCard 
                title="Active Products" 
                value={stats.products} 
                color="blue"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
            />
            </div>

            {/* Quick Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 text-gray-900">System Status</h2>
                    <div className="text-green-700 bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="font-medium">All systems operational. Database connected.</span>
                    </div>
                </div>

                {/* Placeholder for Recent Activity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-gray-900 font-bold">Recent Orders</h3>
                    <p className="text-sm text-gray-500">No recent activity to display.</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
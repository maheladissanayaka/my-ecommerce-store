import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import  Product  from "@/models/Product"; // Ensure this import is correct based on your file structure
import AdminSidebar from "../_components/AdminSidebar";
import Link from "next/link";
import ProductRow from "./_components/ProductRow";
import ProductMobileItem from "./_components/ProductMobileItem";

// Helper to fetch raw data
async function getAdminProducts() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const products = await getAdminProducts();

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your clothing collection and stock.</p>
          </div>
          
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-pink-700 hover:to-rose-700 transition shadow-lg shadow-pink-200 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New Item
          </Link>
        </div>

        {/* Content Area */}
        {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500">Get started by adding your first fashion item.</p>
            </div>
        ) : (
            <>
                {/* 1. DESKTOP VIEW: Table */}
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="p-4 font-semibold">Image</th>
                            <th className="p-4 font-semibold">Product Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Stock Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product: any) => (
                            <ProductRow key={product._id} product={product} />
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 2. MOBILE VIEW: Grid of Cards */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                    {products.map((product: any) => (
                        <ProductMobileItem key={product._id} product={product} />
                    ))}
                </div>
            </>
        )}
      </main>
    </div>
  );
}
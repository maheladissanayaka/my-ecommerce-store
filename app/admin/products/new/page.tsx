import Link from "next/link";
import ProductForm from "./_components/ProductForm";
import AdminSidebar from "../../_components/AdminSidebar"; // Ensure path is correct

export default function AddProductPage() {
  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-3xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        Add New Product
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create a new item for your fashion collection.
                    </p>
                </div>
                <Link
                    href="/admin/products"
                    className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors px-4 py-2 hover:bg-red-50 rounded-lg"
                >
                    Cancel
                </Link>
            </div>

            {/* Form Container */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <ProductForm />
            </div>
            
        </div>
      </main>
    </div>
  );
}
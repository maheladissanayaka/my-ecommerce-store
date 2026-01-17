import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProducts } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import CartButton from "@/components/ui/CartButton";
import ProductSearch from "@/components/product/ProductSearch"; // <--- Import this

// 1. Accept searchParams as props (Next.js does this automatically)
export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const session = await getServerSession(authOptions);

  // 2. Pass the params to the database service
  // Await searchParams because in Next.js 15+ params are promises (safe to await in 14 too)
  const resolvedParams = await searchParams; 
  const products = await getProducts(resolvedParams);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER SECTION */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold">
            TechStore
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <CartButton />
            {session ? (
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-sm hidden sm:inline">
                  Hello, <b>{session.user?.name?.split(" ")[0]}</b>
                </span>
                <Link href="/orders" className="text-sm font-medium hover:text-blue-600 transition">
                  My Orders
                </Link>
                <Link href="/api/auth/signout" className="text-red-500 text-sm hover:underline">
                  Logout
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <Link href="/login" className="hover:underline">Login</Link>
                <Link href="/register" className="bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
        
        {/* 3. Add the Search Bar Here */}
        <ProductSearch />

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          {resolvedParams?.q ? `Results for "${resolvedParams.q}"` : "Latest Products"}
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
            <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
import { getProducts } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import ProductSearch from "@/components/product/ProductSearch"; // Keep search logic here for body content
import Hero from "@/components/home/Hero"; // Import the Hero component
import Link from "next/link";

// 1. Accept searchParams as props
export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  
  // 2. Pass the params to the database service
  // Await searchParams for Next.js 15+ compatibility
  const resolvedParams = await searchParams; 
  const products = await getProducts(resolvedParams);

  return (
    <div className="bg-white">
      
      {/* HERO SECTION (Only show if not searching) */}
      {!resolvedParams?.q && !resolvedParams?.category && (
        <Hero />
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        
        {/* Search & Filter Bar */}
        <div className="mb-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                    {resolvedParams?.q ? `Results for "${resolvedParams.q}"` : "Trending Now"}
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    {resolvedParams?.q 
                        ? "We found these styles matching your search." 
                        : "Handpicked selections just for you. Explore the finest fabrics and cuts of the season."}
                </p>
            </div>
            <ProductSearch />
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No styles found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any matches for your filters.</p>
            <Link 
                href="/" 
                className="inline-block bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              View All Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  // Safe fallback if images are missing
  const mainImage = product.images?.[0] || "/placeholder.jpg";
  const hoverImage = product.images?.[1] || mainImage;

  return (
    <div className="group relative block">
       {/* Wishlist Button - Fixed Accessibility */}
      <button 
        type="button"
        aria-label="Add to Wishlist" // ✅ This fixes the "discernible text" error
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      </button>

      {/* New Badge */}
      <span className="absolute top-3 left-3 z-20 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
        New
      </span>

      <Link href={`/product/${product._id}`}>
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
          {/* Main Image */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-0"
          />
          {/* Second Image (Shown on Hover) */}
          <Image
            src={hoverImage}
            alt={product.name}
            fill
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
          />
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{product.category}</p>
          <h3 className="text-base font-bold text-gray-900 group-hover:text-pink-600 transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
}
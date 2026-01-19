"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductMobileItemProps {
  product: {
    _id: string;
    name: string;
    price: number;
    category: string;
    images?: string[];
    image?: string;
    stock: number;
  };
}

export default function ProductMobileItem({ product }: ProductMobileItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const displayImage = product.images?.[0] || product.image || "/placeholder.jpg";

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    setIsDeleting(true);
    await fetch(`/api/products/${product._id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
      {/* Image */}
      <div className="relative w-20 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        <Image src={displayImage} alt={product.name} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 truncate pr-2">{product.name}</h3>
            <span className="font-bold text-pink-600">${product.price}</span>
        </div>
        
        <p className="text-xs text-gray-500 uppercase tracking-wide mt-1 mb-2">{product.category}</p>
        
        <div className="flex justify-between items-end">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
                {product.stock > 0 ? "In Stock" : "Out"}
            </span>

            <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1"
            >
                {isDeleting ? "..." : "Delete"}
            </button>
        </div>
      </div>
    </div>
  );
}
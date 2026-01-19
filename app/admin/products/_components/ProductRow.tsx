"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductRowProps {
  product: {
    _id: string;
    name: string;
    price: number;
    category: string;
    images?: string[]; // Support array from new model
    image?: string;    // Support string from old model
    stock: number;
  };
}

export default function ProductRow({ product }: ProductRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle both image formats safely
  const displayImage = product.images?.[0] || product.image || "/placeholder.jpg";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete.");
        setIsDeleting(false);
      }
    } catch (error) {
      alert("Error deleting product.");
      setIsDeleting(false);
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-pink-50/30 transition-colors group">
      <td className="p-4">
        <div className="relative w-12 h-16 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <Image 
            src={displayImage} 
            alt={product.name} 
            fill 
            className="object-cover" 
          />
        </div>
      </td>
      <td className="p-4">
        <div className="font-bold text-gray-900">{product.name}</div>
        <div className="text-xs text-gray-400 md:hidden">{product.category}</div>
      </td>
      <td className="p-4 text-gray-500 hidden md:table-cell">
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase tracking-wider font-medium">
            {product.category}
        </span>
      </td>
      <td className="p-4 font-medium text-gray-900">${product.price}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
          product.stock > 0 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
          {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
        </span>
      </td>
      <td className="p-4 text-right">
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
          title="Delete Product"
        >
          {isDeleting ? (
            <span className="animate-spin block h-5 w-5 border-2 border-red-500 rounded-full border-t-transparent"></span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          )}
        </button>
      </td>
    </tr>
  );
}
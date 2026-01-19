"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductGallery from "./_components/ProductGallery";
import ProductInfo from "./_components/ProductInfo";

// Define the interface
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Logic
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Product Not Found</h2>
        <p className="mb-6">This item may have been sold out.</p>
        <Link href="/" className="text-pink-600 underline hover:text-pink-800">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4 py-6">
            <nav className="text-sm text-gray-500 flex items-center gap-2">
                <Link href="/" className="hover:text-black transition">Home</Link>
                <span>/</span>
                <span className="capitalize">{product.category}</span>
                <span>/</span>
                <span className="text-black font-medium line-clamp-1">{product.name}</span>
            </nav>
        </div>

        {/* Main Content Grid */}
        <div className="container mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
                
                {/* Left Side: Gallery */}
                <ProductGallery images={product.images} name={product.name} />

                {/* Right Side: Details & Actions */}
                <ProductInfo product={product} />
                
            </div>
        </div>
    </div>
  );
}
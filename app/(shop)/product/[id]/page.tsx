"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProductGallery from "./_components/ProductGallery";
import ProductInfo from "./_components/ProductInfo";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  rating: number;
  numReviews: number;
  reviews?: Review[]; // 👈 Make this optional to prevent crashes
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch Product
  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // Handle Review Submission
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
        alert("Please sign in to write a review.");
        return;
    }
    setSubmitting(true);

    try {
        const res = await fetch(`/api/products/${id}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, comment }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Review submitted!");
            setShowReviewForm(false);
            setComment("");
            fetchProduct(); // Refresh data
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Something went wrong");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  // 👇 SAFETY CHECK: Ensure reviews is always an array
  const reviews = product.reviews || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Breadcrumb */}
        <div className="bg-white border-b sticky top-0 z-30">
           <div className="container mx-auto px-4 py-4">
             <nav className="text-sm text-gray-500 flex items-center gap-2">
                 <Link href="/" className="hover:text-black">Home</Link> / 
                 <span className="text-black font-medium">{product.name}</span>
             </nav>
           </div>
        </div>

        {/* Main Product Section */}
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <ProductGallery images={product.images} name={product.name} />
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* --- REVIEWS SECTION --- */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8" id="reviews">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        Customer Reviews 
                        <span className="text-base font-normal text-gray-500">({product.numReviews || 0})</span>
                    </h2>
                    
                    {!showReviewForm && (
                        <button 
                            onClick={() => setShowReviewForm(true)}
                            className="px-6 py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition shadow-lg"
                        >
                            Write a Review
                        </button>
                    )}
                </div>

                {/* REVIEW FORM */}
                {showReviewForm && (
                    <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4">
                        <h3 className="font-bold text-lg mb-4">Write your review</h3>
                        <form onSubmit={submitReview} className="space-y-4">
                            
                            {/* Star Rating Input */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment Input */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Review</label>
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none min-h-[100px]"
                                    placeholder="What did you like or dislike?"
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {submitting ? "Submitting..." : "Submit Review"}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowReviewForm(false)}
                                    className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* REVIEWS LIST */}
                <div className="space-y-8">
                    {/* 👇 FIXED: Use safe 'reviews' variable here */}
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to write one!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{review.name}</p>
                                            <div className="flex text-yellow-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mt-2 pl-14">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
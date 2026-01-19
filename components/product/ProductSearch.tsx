"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state with current URL params
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category && category !== "All") params.set("category", category);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
        <form 
        onSubmit={handleSearch} 
        className="flex flex-col md:flex-row gap-3 items-center"
        role="search"
        >
        
        {/* Search Input Group */}
        <div className="relative flex-1 w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search dresses, tops, accessories..."
                aria-label="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent block w-full pl-11 p-4 shadow-sm transition-shadow hover:shadow-md outline-none"
            />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full md:w-56">
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent block p-4 px-6 appearance-none shadow-sm hover:shadow-md transition-shadow outline-none cursor-pointer"
            >
                <option value="All">All Collections</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Shoes">Shoes</option>
            </select>
            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>

        {/* Search Button */}
        <button
            type="submit"
            className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
            Search
        </button>
        </form>
    </div>
  );
}
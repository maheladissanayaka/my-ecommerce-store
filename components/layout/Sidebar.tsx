"use client";

import { useUIStore } from "@/store/useUIStore";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const router = useRouter();

  // Handle Logic
  const handleApplyFilter = () => {
    // In a real app, update URL params
    console.log(`Filtering: Price ${minPrice}-${maxPrice}, Size: ${selectedSize}`);
    closeSidebar();
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-black text-white">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-pink-500" />
              <h2 className="text-lg font-bold tracking-wide uppercase">Filters</h2>
            </div>
            {/* FIX 1 & 2: Added type="button" and aria-label */}
            <button 
              type="button"
              aria-label="Close Sidebar"
              onClick={closeSidebar}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input 
                        type="number" 
                        placeholder="Min" 
                        aria-label="Minimum Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-6 py-2 text-sm outline-none focus:border-pink-500 transition"
                    />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        aria-label="Maximum Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-6 py-2 text-sm outline-none focus:border-pink-500 transition"
                    />
                </div>
              </div>
            </div>

            {/* Sizes Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Select Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  /* FIX 3: Added type="button" */
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      py-2 text-sm font-bold rounded-lg border transition-all duration-200
                      ${selectedSize === size 
                        ? "bg-black text-white border-black shadow-md" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Links (Optional) */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
              <ul className="space-y-3 text-sm font-medium text-gray-600">
                <li className="hover:text-pink-600 cursor-pointer transition">New Arrivals</li>
                <li className="hover:text-pink-600 cursor-pointer transition">Summer Collection</li>
                <li className="hover:text-pink-600 cursor-pointer transition">Best Sellers</li>
                <li className="hover:text-pink-600 cursor-pointer transition">Clearance</li>
              </ul>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {/* FIX 4: Added type="button" */}
            <button 
                type="button"
                onClick={handleApplyFilter}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:from-pink-700 hover:to-rose-600 transition-all transform active:scale-95"
            >
                Apply Filters
            </button>
            {/* FIX 5: Added type="button" */}
            <button 
                type="button"
                onClick={() => { setMinPrice(""); setMaxPrice(""); setSelectedSize(""); }}
                className="w-full mt-3 text-sm text-gray-500 font-medium hover:text-black transition"
            >
                Clear All
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
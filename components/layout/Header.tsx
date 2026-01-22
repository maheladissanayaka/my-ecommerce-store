"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/store/useCart";
import { useUIStore } from "@/store/useUIStore";
import { Menu, Search, User, LogOut, Heart, Package, LayoutDashboard, X } from "lucide-react";
import CartButton from "../ui/CartButton"; 

export default function Header() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const { toggleSidebar } = useUIStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [category, setCategory] = useState("All");

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* LEFT: Sidebar Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            aria-label="Open Menu" // ✅ Existing good practice
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-black">
              LUMINA
            </span>
            <span className="text-[10px] md:text-xs font-bold text-pink-600 tracking-[0.3em] uppercase">
              Fashion
            </span>
          </Link>
        </div>

        {/* MIDDLE: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
          <div className="flex w-full border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100 transition-all">
            
            {/* Category Select */}
            <div className="relative border-r border-gray-200 bg-gray-50">
              {/* FIX 1: Added aria-label for the Select element */}
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Select Category" 
                className="h-full pl-4 pr-8 py-2 bg-transparent text-sm font-medium text-gray-700 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition"
              >
                <option>All</option>
                <option>Dresses</option>
                <option>Tops</option>
                <option>Shoes</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </span>
            </div>

            {/* Input */}
            <input 
              type="text"
              placeholder="Search for elegant styles..."
              aria-label="Search products"
              className="flex-1 px-4 py-2 text-gray-900 outline-none"
            />

            {/* Search Button */}
            {/* FIX 2: Added aria-label for the Icon-only button */}
            <button 
              aria-label="Search"
              className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white px-6 flex items-center justify-center transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          <CartButton />

          {/* User Section */}
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
                aria-label="User menu" // ✅ Added for accessibility
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-pink-500 transition-all">
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </button>

              {/* Dropdown Content... (No changes needed here) */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-5">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      {session.user.role === 'admin' && (
                        <Link 
                          href="/admin" 
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link href="/favorites" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                        <Heart className="w-4 h-4" /> My Favorites
                      </Link>
                      <div className="h-px bg-gray-100 my-1" />
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden md:block px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-black transition-colors">
                Log In
              </Link>
              <Link href="/register" className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex w-full border border-gray-200 rounded-full overflow-hidden bg-gray-50">
          <input 
            type="text" 
            placeholder="Search..." 
            aria-label="Mobile Search"
            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm" 
          />
          {/* FIX 3: Added aria-label for Mobile Search Button */}
          <button 
            aria-label="Search"
            className="bg-pink-600 text-white px-4 flex items-center justify-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
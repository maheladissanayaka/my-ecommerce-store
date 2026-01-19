"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse bg-white">
      {/* Right Side - Image (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/register-fashion.jpg" // Add a different fashion image here
          alt="Fashion Style"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-rose-900/20" /> {/* Reddish tint overlay */}
        <div className="absolute bottom-10 right-10 text-white text-right p-4">
          <h2 className="text-4xl font-bold mb-2">Join the Club</h2>
          <p className="text-lg opacity-90">Exclusive styles, just for you.</p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already a member?{" "}
              <Link href="/login" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
                Log in here
              </Link>
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {error && (
              <div className="mb-4 p-3 rounded bg-red-50 text-red-500 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-200 focus:border-pink-500 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@fashion.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-200 focus:border-pink-500 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-200 focus:border-pink-500 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 transform active:scale-95 disabled:opacity-70"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
            </form>
            
            <p className="mt-6 text-center text-xs text-gray-500">
              By signing up, you agree to our <a href="#" className="underline hover:text-gray-900">Terms of Service</a> and <a href="#" className="underline hover:text-gray-900">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
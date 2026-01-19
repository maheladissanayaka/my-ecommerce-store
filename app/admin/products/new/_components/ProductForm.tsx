"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Dresses", // Changed default to fashion category
    images: [] as string[], // Supports array
    stock: "",
    // New fields for fashion
    sizes: [] as string[],
    colors: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) {
        // Append to images array
        setFormData((prev) => ({ ...prev, images: [...prev.images, json.url] }));
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Fashion Item Created!");
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("❌ Failed to create product.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* 1. Basic Details Section */}
      <div className="space-y-5">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold border-b pb-2">Basic Details</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
            <input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="e.g. Summer Floral Maxi Dress"
                value={formData.name} 
                required 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all" 
                onChange={handleChange} 
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
                id="description" 
                name="description" 
                placeholder="Describe the fabric, fit, and style..."
                value={formData.description} 
                required 
                rows={4} 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all resize-none" 
                onChange={handleChange} 
            />
          </div>
      </div>

      {/* 2. Pricing & Category Section */}
      <div className="space-y-5">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold border-b pb-2">Inventory Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">$</span>
                    <input 
                        id="price" 
                        name="price" 
                        type="number" 
                        placeholder="0.00"
                        value={formData.price} 
                        required 
                        step="0.01" 
                        className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all" 
                        onChange={handleChange} 
                    />
                </div>
            </div>
            <div>
                <label htmlFor="stock" className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                <input 
                    id="stock" 
                    name="stock" 
                    type="number" 
                    placeholder="e.g. 50"
                    value={formData.stock} 
                    required 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all" 
                    onChange={handleChange} 
                />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <div className="relative">
                <select 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer" 
                    onChange={handleChange}
                >
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
          </div>
      </div>

      {/* 3. Image Upload Section */}
      <div className="space-y-5">
        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold border-b pb-2">Visuals</h3>
        
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Images</label>
            
            <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                        ) : (
                            <>
                                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </>
                        )}
                    </div>
                    <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                </label>
            </div>

            {/* Preview Grid */}
            {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.images.map((img, index) => (
                        <div key={index} className="relative aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                            <Image src={img} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" className="text-white text-xs bg-red-500 px-2 py-1 rounded">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-pink-600 hover:to-rose-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {loading ? "Creating Product..." : "Launch Product"}
        </button>
      </div>
    </form>
  );
}
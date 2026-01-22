"use client";

import { useCart } from "@/store/useCart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Sri Lanka",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session) {
        alert("Please login to checkout");
        router.push("/login");
        return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalAmount: totalAmount(),
          shippingAddress: formData, 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart(); 
        // 👇 FIXED: Redirect to Success Page instead of Order Details
        router.push(`/success?orderId=${data.orderId}`); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
      return <div className="min-h-screen flex items-center justify-center">Your Cart is Empty</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h2>
        
        <div className="mb-6 border-b pb-4">
            <p className="text-gray-600">Total Items: <span className="font-bold text-black">{cart.length}</span></p>
            <p className="text-xl font-bold text-black mt-2">Total: ${totalAmount().toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Street Address</label>
            <input name="street" required onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="123 Main St" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input name="city" required onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="Colombo" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">State / Province</label>
                <input name="state" required onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="Western" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input name="zip" required onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="10100" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input name="country" required onChange={handleChange} value={formData.country} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input name="phone" required onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="+94 77 123 4567" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Place Order (COD)"}
          </button>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/store/useCart";

interface Address {
  _id?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface User {
  name?: string | null;
  email?: string | null;
}

export default function CheckoutForm({ user }: { user?: User | null }) {
  const { cart, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const total = totalAmount();

  // State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "COD">("Card");

  // Form Data
  const initialForm = {
    name: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Sri Lanka",
  };
  const [formData, setFormData] = useState<Address>(initialForm);

  // 1. Fetch Addresses
  useEffect(() => {
    fetch("/api/user/address")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setSavedAddresses(list);
        if (list.length > 0) {
          // Select the last added address by default
          setSelectedAddressId(list[list.length - 1]._id || null);
        } else {
          setShowAddressForm(true);
        }
      });
  }, []);

  // 2. Handle Inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Save Address
  const handleSaveAddress = async () => {
    if (!formData.street || !formData.city || !formData.phone) {
        alert("Please fill in required fields.");
        return;
    }
    
    setLoading(true);
    try {
      const method = editingAddressId ? "PUT" : "POST";
      const body = editingAddressId 
        ? { addressId: editingAddressId, updatedAddress: formData }
        : { address: formData };

      const res = await fetch("/api/user/address", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const updatedList = await res.json();
      setSavedAddresses(updatedList);
      
      // Select the new/updated address
      if (!editingAddressId && updatedList.length > 0) {
         const newAddr = updatedList[updatedList.length - 1];
         setSelectedAddressId(newAddr._id);
      }

      setShowAddressForm(false);
      setEditingAddressId(null);
    } catch (error) {
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr: Address) => {
    setFormData(addr);
    setEditingAddressId(addr._id || null);
    setShowAddressForm(true);
  };

  const handleAddNew = () => {
    setFormData(initialForm);
    setEditingAddressId(null);
    setShowAddressForm(true);
  };

  const handlePlaceOrder = async () => {
    const finalAddress = savedAddresses.find(a => a._id === selectedAddressId);
    if (!finalAddress) {
      alert("Please select a shipping address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          shippingAddress: finalAddress,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        if (paymentMethod === "COD") clearCart(); 
        window.location.href = data.url; 
      } else {
        alert(data.message || "Order Failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT SIDE */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* --- SHIPPING ADDRESS --- */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
            {!showAddressForm && (
              <button 
                onClick={handleAddNew}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                + Add New Address
              </button>
            )}
          </div>

          {showAddressForm ? (
            /* --- FORM VIEW --- */
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
               <h3 className="font-bold text-gray-800 border-b pb-2">
                 {editingAddressId ? "Edit Address" : "Add New Address"}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="p-3 border rounded-xl w-full" />
                  <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="p-3 border rounded-xl w-full" />
               </div>
               <input name="street" placeholder="Street Address" value={formData.street} onChange={handleInputChange} className="p-3 border rounded-xl w-full" />
               <div className="grid grid-cols-2 gap-4">
                  <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="p-3 border rounded-xl w-full" />
                  <input name="state" placeholder="State/Province" value={formData.state} onChange={handleInputChange} className="p-3 border rounded-xl w-full" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <input name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleInputChange} className="p-3 border rounded-xl w-full" />
                  <input name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} className="p-3 border rounded-xl w-full" />
               </div>
               
               <div className="flex gap-3 pt-2">
                 <button onClick={handleSaveAddress} disabled={loading} className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition">
                   {loading ? "Saving..." : "Save Address"}
                 </button>
                 <button onClick={() => setShowAddressForm(false)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                   Cancel
                 </button>
               </div>
            </div>
          ) : (
            /* --- LIST VIEW --- */
            <div className="space-y-3">
              {/* Scrollable container if list gets long */}
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {savedAddresses.map((addr) => (
                  <div 
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id || null)}
                    className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all flex items-start justify-between group ${
                      selectedAddressId === addr._id 
                        ? "border-red-500 bg-white ring-1 ring-red-500 shadow-sm" // Active Style
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Radio Button */}
                      <div className="mt-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAddressId === addr._id ? "border-red-500" : "border-gray-300"
                        }`}>
                          {selectedAddressId === addr._id && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <p className="font-bold text-gray-900 text-base">
                           {addr.name} 
                           <span className="text-gray-500 font-normal ml-3 text-sm">{addr.phone}</span>
                        </p>
                        <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state}, {addr.country}, {addr.zip}
                        </p>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 px-3 py-1 rounded bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>

              {savedAddresses.length === 0 && (
                 <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                   <p className="text-gray-500">No saved addresses found.</p>
                   <button onClick={handleAddNew} className="mt-2 text-black font-bold underline">Add one now</button>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* --- PAYMENT METHOD --- */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
           <div className="space-y-3">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}>
                 <input type="radio" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} className="w-5 h-5 accent-red-500" />
                 <span className="ml-3 font-bold text-gray-900">Credit / Debit Card</span>
              </label>
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}>
                 <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 accent-red-500" />
                 <span className="ml-3 font-bold text-gray-900">Cash on Delivery</span>
              </label>
           </div>
        </div>

      </div>

      {/* RIGHT SIDE: SUMMARY */}
      <div className="lg:col-span-4 h-fit sticky top-24">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>
            <div className="space-y-3 text-sm text-gray-600 pb-6 border-b border-gray-100">
               <div className="flex justify-between"><span>Subtotal</span><span>LKR {total.toFixed(2)}</span></div>
               <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
            </div>
            <div className="flex justify-between items-center py-4 mb-2">
               <span className="text-lg font-bold text-gray-900">Total</span>
               <span className="text-2xl font-bold text-gray-900">LKR {total.toFixed(2)}</span>
            </div>
            <button
               onClick={handlePlaceOrder}
               disabled={loading || !selectedAddressId}
               className="w-full bg-red-600 text-white py-4 rounded-full font-bold text-lg hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-xl"
            >
               {loading ? "Processing..." : "Place Order"}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 px-4 leading-relaxed">
               Secure Payment with SSL Encryption.
            </p>
         </div>
      </div>
    </div>
  );
}
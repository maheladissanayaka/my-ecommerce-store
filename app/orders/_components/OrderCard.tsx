"use client";

import Image from "next/image";
import { Package, Truck, CheckCircle, MessageSquare } from "lucide-react";

interface OrderProps {
  order: {
    _id: string;
    createdAt: string;
    totalAmount: number;
    status: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      image: string;
      size?: string;
      color?: string;
    }>;
  };
}

export default function OrderCard({ order }: OrderProps) {
  
  // Helper for Status Colors
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      
      {/* 1. Card Header */}
      <div className="bg-gray-50/50 p-5 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4 items-center">
            <div className="p-2 bg-white rounded-full border border-gray-100 shadow-sm">
                <Package className="w-5 h-5 text-pink-600" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                <p className="font-mono text-sm font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
            </div>
        </div>
        
        <div className="text-right">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                {order.status}
            </span>
        </div>
      </div>

      {/* 2. Order Items */}
      <div className="p-5 space-y-6">
        {order.items.map((item, index) => (
          <div key={index} className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Product Details */}
            <div className="flex-grow flex flex-col justify-between py-1">
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                    {item.size && <span className="mr-3">Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                </p>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Footer: Total & Actions */}
      <div className="p-5 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-6 items-center justify-between">
        
        {/* Total Price */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            <span className="text-sm text-gray-500 font-medium">Total Amount:</span>
            <span className="text-xl font-black text-gray-900">${order.totalAmount.toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full md:w-auto">
            {/* Feedback Button */}
            <button 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:bg-white hover:border-pink-500 hover:text-pink-600 transition-all bg-transparent"
            >
                <MessageSquare className="w-4 h-4" />
                Feedback
            </button>

            {/* Received Button */}
            <button 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
                <CheckCircle className="w-4 h-4" />
                Received
            </button>
        </div>
      </div>

    </div>
  );
}
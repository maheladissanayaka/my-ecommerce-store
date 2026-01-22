import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

// 1. Define the type for the items coming from the frontend
interface CheckoutItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, totalAmount } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }
    
    if (!shippingAddress) {
        return NextResponse.json({ message: "Address missing" }, { status: 400 });
    }

    await connectDB();

    // 2. Create Order (Using the CheckoutItem type instead of 'any')
    const newOrder = await Order.create({
      user: session.user.id,
      items: items.map((item: CheckoutItem) => ({
        product: item._id,
        name: item.name,
        image: item.images?.[0] || "/placeholder.jpg", 
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize || "N/A", 
        color: item.selectedColor || "N/A"
      })),
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      status: "pending",
      paymentMethod: "COD"
    });

    return NextResponse.json({ message: "Order placed successfully", orderId: newOrder._id }, { status: 201 });

  } catch (error) {
    console.error("🔥 Checkout Server Error:", error);
    return NextResponse.json({ message: "Error placing order" }, { status: 500 });
  }
}
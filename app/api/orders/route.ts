import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; 

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized", url: "/login" }, { status: 401 });
    }

    // 1. Get ALL required data (including Shipping & Payment)
    const { items, totalAmount, shippingData, paymentMethod } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    await connectDB();

    // 2. Find the User ID robustly
    let userId = (session.user as any).id;
    if (!userId) {
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        userId = user._id;
    }

    // 3. TRANSFORM DATA: Map items to match your Schema
    const orderItems = items.map((item: any) => ({
      product: item._id, // Map cart '_id' to Schema 'product'
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      // Fix: Handle Image Array vs String
      image: Array.isArray(item.images) ? item.images[0] : (item.image || "/placeholder.jpg"),
      // Fix: Include Fashion Variants (Required by Schema)
      size: item.selectedSize || "N/A", 
      color: item.selectedColor || "N/A",
    }));

    // 4. Create Order
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "pending",
      paymentMethod: paymentMethod || "COD",
      shippingAddress: shippingData, // <--- CRITICAL: Required by your Model
    });

    // Return URL so frontend can redirect
    return NextResponse.json({ 
        message: "Order placed!", 
        orderId: newOrder._id,
        url: `/success?orderId=${newOrder._id}`
    }, { status: 201 });

  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ message: "Error placing order", error }, { status: 500 });
  }
}
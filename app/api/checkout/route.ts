import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Authentication Check
    if (!session || !session.user?.email) {
      return NextResponse.json({ url: "/login" }, { status: 401 });
    }

    // 2. Extract Data (Added shippingData)
    const { items, totalAmount, paymentMethod, shippingData } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    await connectDB();

    // 3. Robust User ID Lookup
    let userId = session.user.id;
    if (!userId) {
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) userId = dbUser._id;
    }

    // 4. Create Order with Fashion Details
    const newOrder = await Order.create({
      user: userId,
      // Map Cart Items to Order Items
      items: items.map((item: any) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        // Fix: Take the first image if it's an array, otherwise use the string
        image: Array.isArray(item.images) ? item.images[0] : item.image,
        // Fix: Include Fashion Variants
        size: item.selectedSize || "N/A", 
        color: item.selectedColor || "N/A",
      })),
      totalAmount,
      status: "pending", // Use lowercase to match your Enum
      paymentMethod,
      // Fix: Save the address snapshot
      shippingAddress: shippingData, 
    });

    // 5. Return success URL with Order ID
    // This allows your Success Page to show the "Order #123456"
    return NextResponse.json({ url: `/success?orderId=${newOrder._id}` });
    
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing your order." }, 
      { status: 500 }
    );
  }
}
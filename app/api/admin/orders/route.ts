import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // Ensure User model is registered

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Security Check: Admin Only
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 2. Fetch All Orders
    // .populate("user", "name email") -> Get the customer's name and email
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 }); // Newest first

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // Keeping this ensures Mongoose registers the model

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Security Check: Admin Only
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 2. Fetch All Orders
    // We populate 'user' to show the Customer Name & Email in the dashboard
    // The 'items' array already contains the snapshot of Size/Color from the Order model
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 }); // Newest orders first

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}
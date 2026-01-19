import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Security Check
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Await Params (Next.js 15 requirement)
    const { id } = await params;
    const { status } = await req.json();

    // 3. Validation: Ensure status matches your Order Model enums
    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value. Allowed: " + validStatuses.join(", ") }, 
        { status: 400 }
      );
    }

    await connectDB();

    // 4. Update Order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document to update UI immediately
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 }
    );
  }
}
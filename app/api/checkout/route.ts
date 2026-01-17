import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Stripe from "stripe";

// Initialize Stripe with the EXACT version required by your installed library
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover" as any, // <--- FIX IS HERE
  // Adding 'as any' tells TypeScript: "Trust me, this string is fine."
  // This prevents the error even if the library updates again in the future.
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ url: "/login" }, { status: 401 });
    }

    const { items, totalAmount } = await req.json();

    await connectDB();

    // 1. Create Order (Pending)
    const newOrder = await Order.create({
      user: session.user.id,
      items: items.map((item: any) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount,
      status: "pending",
    });

    // 2. Format for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // 3. Create Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/success?orderId=${newOrder._id}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: session.user.id,
      },
      customer_email: session.user.email || undefined,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Stripe from "stripe";

interface CheckoutItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
  selectedSize?: string;
  selectedColor?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // Matching your library version
  typescript: true,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, totalAmount, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    await connectDB();

    // 1. Create Order
    // The paymentMethod passed here will now be "COD" or "Card", matching your Schema
    const newOrder = await Order.create({
      user: session.user.id,
      items: items.map((item: CheckoutItem) => ({
        product: item._id,
        name: item.name,
        image: item.images?.[0] || "/placeholder.jpg",
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize || "N/A",
        color: item.selectedColor || "N/A",
      })),
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod, 
      status: "pending",
      isPaid: false,
    });

    // 2. Handle Payment Methods
    // 👇 FIXED: Check for uppercase "COD"
    if (paymentMethod === "COD") {
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${newOrder._id}`,
      });
    } 
    // 👇 FIXED: Check for capitalized "Card"
    else if (paymentMethod === "Card") {
      const line_items = items.map((item: CheckoutItem) => ({
        price_data: {
          currency: "lkr", 
          product_data: {
            name: item.name,
            images: [item.images?.[0] || ""],
          },
          unit_amount: Math.round(item.price * 100), 
        },
        quantity: item.quantity,
      }));

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"], // Stripe API still expects lowercase here, that's fine
        line_items: line_items,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-error`, 
        metadata: {
          orderId: newOrder._id.toString(),
          userId: session.user.id,
        },
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    return NextResponse.json({ message: "Invalid payment method" }, { status: 400 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
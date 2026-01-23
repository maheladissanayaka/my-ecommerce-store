import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

interface Review {
  user: string | { toString(): string };
  rating: number;
  comment: string;
  name: string;
}

export async function POST(
  req: Request,
  // 👇 FIX 1: Type 'params' as a Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // 👇 FIX 2: Await the params to get the ID
    const { id } = await params;

    // 1. Check if user is logged in
    if (!session) {
      return NextResponse.json({ message: "Please login to write a review" }, { status: 401 });
    }

    const { rating, comment } = await req.json();
    
    // 👇 Use the unwrapped 'id' here
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 2. Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r: Review) => r.user.toString() === session.user.id.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json({ message: "You have already reviewed this product" }, { status: 400 });
    }

    // 3. Add new review
    const review = {
      name: session.user.name || "Anonymous",
      rating: Number(rating),
      comment,
      user: session.user.id,
    };

    product.reviews.push(review);

    // 4. Recalculate Average Rating
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc: number, item: Review) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    return NextResponse.json({ message: "Review added successfully", reviews: product.reviews });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
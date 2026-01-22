import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// 1. GET: Fetch a single product by ID (Public)
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const params = await props.params; // Next.js 15 await
    
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
  }
}

// 2. DELETE: Remove a product (Admin Only)
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Security Check
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const params = await props.params; // Next.js 15 await

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}

// 3. PUT: Update a product (Admin Only)
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Security Check
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const params = await props.params; // Next.js 15 await
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Security Check
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // 2. Destructure all the new Fashion fields
    const { 
      name, 
      description, 
      price, 
      category, 
      images, // Array of strings
      sizes,  // Array of strings
      colors, // Array of strings
      stock,  // Number
      isNewArrival 
    } = body;

    // 3. Validation
    // Ensure 'images' is an array and has at least one image
    if (!name || !description || !price || !category || !images || images.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // 4. Create Product
    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      images, // Save the array
      sizes: sizes || [],
      colors: colors || [],
      stock: Number(stock) || 0, // Ensure it's a number
      inStock: Number(stock) > 0, // Auto-calculate boolean
      isNewArrival: isNewArrival || false,
    });

    return NextResponse.json(
      { message: "Product created", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}
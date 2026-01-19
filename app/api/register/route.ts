import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" }, 
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" }, 
        { status: 400 }
      );
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user
    // Note: The 'role' will default to 'user' based on your User Schema
    await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    return NextResponse.json(
      { message: "Account created successfully" }, 
      { status: 201 }
    );

  } catch (error) {
    // Log the actual error on the server console for debugging
    console.error("Registration Error:", error);

    // Return a generic message to the user (Safe)
    return NextResponse.json(
      { message: "Something went wrong. Please try again." }, 
      { status: 500 }
    );
  }
}
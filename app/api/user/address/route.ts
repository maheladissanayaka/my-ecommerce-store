import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET: Fetch Addresses
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id);
  // Always return an array, never undefined
  return NextResponse.json(user?.addresses || []);
}

// POST: Add New Address
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { address } = await req.json();
  await connectDB();

  // 👇 FORCE UPDATE: This works even if the addresses array is missing
  const updatedUser = await User.findByIdAndUpdate(
    session.user.id,
    { $push: { addresses: address } }, 
    { new: true, upsert: true } // 'upsert' creates fields if missing
  );

  return NextResponse.json(updatedUser?.addresses || []);
}

// PUT: Update Address
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { addressId, updatedAddress } = await req.json();
  await connectDB();

  const user = await User.findById(session.user.id);
  const addressDoc = user.addresses.id(addressId);
  
  if (addressDoc) {
    addressDoc.set(updatedAddress);
    await user.save();
  }

  return NextResponse.json(user.addresses);
}
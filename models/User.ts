import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: false, // Not required if using Google Login
      select: false,   // Prevents password from being returned in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// This check is important in Next.js to prevent "OverwriteModelError"
const User = models.User || model("User", UserSchema);

export default User;
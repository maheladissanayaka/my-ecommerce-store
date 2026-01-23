import mongoose, { Schema, model, models } from "mongoose";

const AddressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, default: "user" },
    image: String,
    // 👇 Ensure this is an array
    addresses: {
      type: [AddressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
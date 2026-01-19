// models/Product.ts
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    // Fashion specific fields
    category: { type: String, required: true }, // e.g., "Dresses", "Tops", "Denim"
    images: [{ type: String, required: true }], // Array of strings (Main img + Hover img)
    sizes: [{ type: String }], // e.g., ["XS", "S", "M", "L", "XL"]
    colors: [{ type: String }], // e.g., ["Red", "Blue", "Black"]
    inStock: { type: Boolean, default: true },
    isNewArrival: { type: Boolean, default: false }, // Great for "New In" sections
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
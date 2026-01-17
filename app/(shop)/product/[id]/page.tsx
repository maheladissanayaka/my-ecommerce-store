import { getProductById } from "@/services/productService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton"; // Import the new button

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link href="/" className="text-gray-500 hover:text-black mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm text-blue-600 font-semibold mb-2 uppercase">{product.category}</span>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">{product.description}</p>
          
          <div className="flex items-center gap-6 mb-8">
            <span className="text-3xl font-bold">${product.price}</span>
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Use the Client Component here */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserOrders } from "@/services/orderService";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { redirect } from "next/navigation";
import Link from "next/link";
import OrderCard from "./_components/OrderCard";
import EmptyOrders from "./_components/EmptyOrders";

// Order Interface
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface OrderType {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch User & Orders
  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  
  // Use .lean() or JSON.parse to ensure serializable data
  const ordersData = await getUserOrders(user._id);
  const orders = JSON.parse(JSON.stringify(ordersData));

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-2">Track your delivery status and purchase history.</p>
          </div>
          <Link 
            href="/" 
            className="text-sm font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Content Section */}
        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-6">
            {orders.map((order: OrderType) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
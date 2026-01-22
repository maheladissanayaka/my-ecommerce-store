import Image from "next/image";

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

export default function OrderCard({ order }: { order: OrderType }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Placed</p>
          <p className="text-sm font-semibold text-gray-900">{date}</p>
        </div>
        <div className="space-y-1">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Reference</p>
           <p className="text-sm font-mono text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
        </div>
        <div className="sm:ml-auto text-right">
             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                ${order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : ''}
                ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
             `}>
                {order.status}
             </span>
        </div>
      </div>

      {/* Items List */}
      <div className="p-6 space-y-6">
        {order.items.map((item, index) => (
          <div key={index} className="flex gap-4 items-center">
            {/* Image */}
            <div className="relative w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
               <Image 
                 src={item.image} 
                 alt={item.name} 
                 fill 
                 className="object-cover"
               />
            </div>
            
            {/* Details */}
            <div className="flex-1 min-w-0">
               <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
               <p className="text-sm text-gray-500">
                 {item.color !== "N/A" && <span className="mr-3">Color: {item.color}</span>}
                 {item.size !== "N/A" && <span>Size: {item.size}</span>}
               </p>
               <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
            </div>

            {/* Price */}
            <div className="text-right">
               <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
         <span className="text-sm font-medium text-gray-500">Total Amount</span>
         <span className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
      </div>

    </div>
  );
}
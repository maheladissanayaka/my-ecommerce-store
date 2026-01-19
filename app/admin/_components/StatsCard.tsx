interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string; // e.g. "+12%"
  color?: "pink" | "blue" | "purple"; // Theme colors
}

export default function StatsCard({ title, value, icon, trend, color = "blue" }: StatsCardProps) {
  
  // Color mapping for attractive styling
  const colorStyles = {
    pink: "bg-pink-50 text-pink-600 border-pink-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                {title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
            {icon}
        </div>
      </div>
      
      {/* Optional Trend Indicator */}
      {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-full flex items-center">
                ▲ {trend}
            </span>
            <span className="text-gray-400 ml-2 text-xs">vs last month</span>
          </div>
      )}
    </div>
  );
}
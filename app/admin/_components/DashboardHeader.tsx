"use client";

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here is what's happening in your store today.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search Bar Visual */}
        <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search..." className="ml-2 bg-transparent outline-none text-sm w-32 focus:w-48 transition-all" />
        </div>

        {/* Profile */}
        <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-pink-200">
          AD
        </div>
      </div>
    </div>
  );
}
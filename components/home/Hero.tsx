import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative w-full h-[85vh] md:h-[90vh] flex items-center justify-center md:justify-start bg-black overflow-hidden">
      
      {/* Background Image - Mobile Optimized */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-fashion.jpg" // Ensure you have a high-quality portrait/landscape fashion image
          alt="Summer Fashion Collection"
          fill
          className="object-cover object-center brightness-[0.70] md:brightness-75 transition-transform duration-[20s] hover:scale-105" // Subtle zoom effect
          priority
        />
        {/* Gradient Overlay for better text readability on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 md:bg-gradient-to-r md:from-black/60 md:to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 text-center md:text-left h-full flex flex-col justify-center">
        
        {/* Animated Text Content */}
        <div className="space-y-6 max-w-3xl animate-fade-in-up">
          <span className="inline-block py-1 px-3 border border-pink-500 rounded-full text-pink-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            New Season 2026
          </span>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
            Summer <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">
              Bloom
            </span> & Grace
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-200 max-w-lg mx-auto md:mx-0 font-light leading-relaxed">
            Experience the new era of elegance. Bold colors, breathable fabrics, and styles that define you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <Link 
              href="/product" 
              className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(219,39,119,0.6)]"
            >
              Shop Collection
            </Link>
            
            <Link 
              href="/categories" 
              className="px-10 py-4 rounded-full font-bold text-lg border-2 border-white text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Styles
            </Link>
          </div>
        </div>

      </div>
      
      {/* Scroll Indicator (Optional but stylish) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block text-white/50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </div>
  );
}
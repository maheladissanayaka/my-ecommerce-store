"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="sticky top-24 space-y-4">
      
      {/* Main Image Container - Constrained Height like AliExpress */}
      <div className="relative w-full h-[500px] bg-white border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-contain p-2" // Uses contain so entire image is seen without cropping
          priority
        />
        
        {/* Zoom Icon Hint */}
        <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full shadow-sm backdrop-blur-sm pointer-events-none">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
           </svg>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`relative w-16 h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
              mainImage === img 
                ? "border-orange-500 opacity-100" 
                : "border-gray-200 opacity-70 hover:opacity-100"
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumb ${index}`} 
              fill 
              className="object-cover" 
            />
          </button>
        ))}
      </div>
    </div>
  );
}
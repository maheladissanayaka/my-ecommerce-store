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
    <div className="space-y-6 sticky top-24">
      {/* Main Large Image - Portrait Mode for Dresses */}
      <div className="relative aspect-[3/4] w-full bg-gray-50 rounded-2xl overflow-hidden shadow-sm group">
        <span className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          New Arrival
        </span>
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      </div>

      {/* Thumbnails - Horizontal Scrollable */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            aria-label={`View view ${index + 1}`}
            onClick={() => setMainImage(img)}
            className={`relative w-20 h-24 flex-shrink-0 snap-start border-2 rounded-xl overflow-hidden transition-all duration-300 ${
              mainImage === img 
                ? "border-black shadow-md scale-105" 
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${index + 1}`} 
              fill 
              className="object-cover" 
            />
          </button>
        ))}
      </div>
    </div>
  );
}
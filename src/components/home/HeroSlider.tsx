"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroSlider({ hero1Url, hero2Url, hero3Url }: { hero1Url?: string, hero2Url?: string, hero3Url?: string }) {
  const slides = [
    {
      image: hero1Url || "/hero-1.png",
      tagline: "NEW ARRIVALS",
      collection: "Autumn / Winter Series",
      position: "center center"
    },
    {
      image: hero2Url || "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop",
      tagline: "EXCLUSIVE DROP",
      collection: "Creative Performance",
      position: "center top"
    },
    {
      image: hero3Url || "https://images.unsplash.com/photo-1539106602048-b6c764c839a5?q=80&w=2000&auto=format&fit=crop",
      tagline: "URBAN ESSENTIALS",
      collection: "Street Style 2024",
      position: "center center"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-black" id="hero-slider">
      {slides.map((slide, idx) => (
        <div key={idx} className={`absolute inset-0 w-full h-full transition-opacity duration-1500 ${currentSlide === idx ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}>
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img 
              alt={`Hero Slide ${idx + 1}`} 
              src={slide.image}
              style={{ objectPosition: slide.position }}
              className={`absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4] ${currentSlide === idx ? 'animate-[ken-burns_10s_forwards]' : ''}`}
            />
          </div>
          <div className="absolute inset-x-0 bottom-24 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <div className="flex flex-col items-center pointer-events-auto">
              <span className={`text-white text-[0.6875rem] font-bold tracking-[0.4em] uppercase opacity-90 mb-6 drop-shadow-md ${currentSlide === idx ? 'animate-[fade-up-slide_0.8s_forwards] delay-200 opacity-0' : 'opacity-0'}`}>
                {slide.tagline}
              </span>
              <button 
                onClick={() => window.location.href = '/products'}
                className={`bg-white text-black px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#EEEEEE] transition-colors duration-200 shadow-lg ${currentSlide === idx ? 'animate-[fade-up-slide_0.8s_forwards] delay-300 opacity-0' : 'opacity-0'}`}
              >
                <span className="border-b-2 border-black pb-1">SHOP NOW</span>
              </button>
            </div>
          </div>
          <div className="absolute bottom-12 left-12 z-30 hidden md:block">
            <span className="text-white/40 text-[0.625rem] tracking-[0.3em] uppercase">{slide.collection}</span>
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-3">
        {slides.map((_, idx) => (
          <button 
            key={idx}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setCurrentSlide(idx)}
            className={`hero-indicator w-12 h-0.5 transition-colors duration-300 ${currentSlide === idx ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
}

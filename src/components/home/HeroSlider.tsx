"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    image: "https://lh3.googleusercontent.com/aida/ADBb0ugLk57sff8RvCUoeT49daC0hOUu7iRw3TjvU2dMCstYbxEq738JWb7bBaYI9DPXenyjKmzIKdiuR1uf2I9jm4DxUEg29Ce64Tohg3QgasYD5RU8s5n_aXKZaM-5iGPLozdKSNhxPjbKOj5MYU86uT_0jU9kLQugmuy4P_CjMNvnUDLqq-B3QoEjVvsdslZrGUxRHevAofiGglE7TudHQadgFooTIg5TPacksJLtrkhIcsoc1QMWJ26irWP-kZee5Sk8hH7qIaDl0ps",
    tagline: "NEW ARRIVALS",
    collection: "Autumn / Winter Series",
    position: "center center"
  },
  {
    image: "https://lh3.googleusercontent.com/aida/ADBb0uhzCX9_9OSmzZ2310-SnyANX5gPDBVtfLoyrFKYc29pLqd22LosjJfwW0G7emVshOWRD-Rg2ned6lzV-ALgpdYB9hoBHPQC-GvY8SNlf2J3nYFFqJgTUekCeQgDZF3shEcR7IwEuuCT_R8lgoKJvjVSk3GorbqoSL06SUGpcLCaejb7tAy_9EBuXbTt2OHEob1do_aTqWJ18J7_-vV7k2ITZLwEL4wNP25l9Y9cNw1sQgRDn_6qzkKLWLiOEYkEN7jw55bnfV8izQ",
    tagline: "EXCLUSIVE DROP",
    collection: "Creative Performance",
    position: "center top"
  }
];

export default function HeroSlider() {
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

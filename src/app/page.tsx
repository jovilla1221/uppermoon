import HeroSlider from "@/components/home/HeroSlider";
import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { allProductsQuery } from "@/sanity/lib/queries";
import BestSellersClient from "@/components/home/BestSellersClient";

import { siteSettingsQuery } from "@/sanity/lib/queries";

export const revalidate = 0;

export default async function Home() {
  let products = [];
  try {
    const sanityProducts = await client.fetch(allProductsQuery);
    products = sanityProducts?.length > 0 ? sanityProducts : [];
  } catch (err) {
    products = [];
  }

  let settings: any = null;
  try {
    settings = await client.fetch(siteSettingsQuery, {}, { next: { revalidate: 60 } });
  } catch (e) { }

  // Get up to 4 products for the best sellers section
  const bestSellers = products.slice(0, 4);

  return (
    <main>
      <HeroSlider hero1Url={settings?.hero1 || ""} hero2Url={settings?.hero2 || ""} />

      {/* Best Sellers */}
      <section className="bg-[#EEEEEE] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[0.6875rem] font-medium tracking-[0.2em] uppercase text-outline mb-4 block">CURATED SELECTION</span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Browse Our Best Selling Products</h2>
            </div>
          </Reveal>

          <BestSellersClient products={bestSellers} />
        </div>
      </section>

      {/* View All Section */}
      <Reveal className="py-16 bg-surface flex flex-col items-center justify-center border-t border-surface-container">
        <span className="font-headline italic text-4xl md:text-5xl text-on-surface-variant mb-6">View all</span>
        <Link href="/products" className="text-[0.6875rem] font-bold tracking-[0.3em] uppercase border-b-[1px] border-on-surface pb-[2px] transition-opacity hover:opacity-70">
          VIEW ALL PRODUCTS
        </Link>
      </Reveal>

      {/* Community Section */}
      <section className="py-24 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="font-headline italic text-5xl md:text-7xl mb-4">Community</h2>
            <p className="text-[0.6875rem] tracking-[0.2em] uppercase text-outline">Tag @uppermoon to get featured</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay={0.1} className="aspect-[3/4] overflow-hidden bg-surface-container group">
              <img alt="lifestyle urban gallery streetwear" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh0eCQWcJLI_RaE2OhZt4aMJ4enrfc8L-md_tZA4ZodK6M1_ON2X0U5YJ7SsowZH9NHVfSyCS5QXP1KpNuKztpWLn1ofQA6PpIIE_HHpbKEiU4enx6at5xjWihC6kxTUnDGsqckU2_zMMyaIDQtlCxFwJUuvw54Vlqs4vAKRUmZYsAlnYKshV9F-wAFHr2pHLiHquk559xYLfd0pJPyiRiUFX6WNjT1lsCAOPZXTJHqyTqbUlgM5t2FjvnsdqzfPYJJicUjLo6IXt8" />
            </Reveal>
            <Reveal delay={0.3} className="aspect-[3/4] overflow-hidden bg-surface-container md:mt-12 group">
              <img alt="editorial fashion brutalist wall" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDDGzZQ3tRt0uyxcSIewtbRr1_Yut86w0ADHh6YhYL6CvZVfCfJhFlL1nDXL0kCm2h-kHlhjPFNth0zzRLqqOHnkEkuh28Xd0KOjQMklyGmtDvfPuLnDCcy7MMh8bAXbpXMA34CCYG3O_VsoD2iNAvLbrAheJ3e5oBd0DuOQXYIu-Yt-a1QV6p-GzBPfYIQori_TP5q6CMMArAlYSprBbY2d6Ba_KnPZtXpH-epdpYlb3I6TWVXKlFPl5t3LQnmkJtcHe-Lxn821ZA" />
            </Reveal>
            <Reveal delay={0.5} className="aspect-[3/4] overflow-hidden bg-surface-container group">
              <img alt="street style technical gear" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChIHvtJUfTD1gewJX3_-WCVjEdvE3GZ2nA946f32jZD7RKUKJSWgCHOanh0Bpd9AAosA1bWJfniDaX6_LAV31921RhAIW_eRLiFyD0xOCdOjxxwjwEUsGHoYFtrAmC4773D4yuCmCFwaBoAY0NXUycPYQI3oPKIk3q0LP61QAvQbFmpR63p9WAGCexVQ9K5uzJP_G__almd9IdtZ8JvMMDxzuqg4ImvrqSpvnOjeZS-iyMElTZYWjSBSfUJdsGhD9kVPhucn9cazlX" />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

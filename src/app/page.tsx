import HeroSlider from "@/components/home/HeroSlider";
import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      
      {/* Best Sellers */}
      <section className="bg-[#EEEEEE] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[0.6875rem] font-medium tracking-[0.2em] uppercase text-outline mb-4 block">CURATED SELECTION</span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Browse Our Best Selling Products</h2>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 bg-outline/10">
            {/* Product Card 1 */}
            <Reveal delay={0.1} className="bg-surface-container-lowest group cursor-pointer p-6">
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-surface-container">
                <img alt="minimalist charcoal grey oversized hoodie" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN7ELpfys-dndu-RhSuD3pcdQrS8I3xiiDYyWI2PN8VRGZK4N5bYFw_dX9Lo_CCZnTHHeI8vIY1wNu3rpNBGjksYsrIMKDPYINfagFtNQc9SqTvoY3tywVobN8Ho_pmDtbh3eSgJ5o6zwzxW3NSfSWOl5VCn150JRcTw-wsI4zlxsywfhcSamymnUP0lY9zWolA0GR6bfC_0mIJnriHR_wSTM2DEnafEdNQUrQwuiRyjwPOmFdMtcpbbpRUl9MuKJUyr0pG7r1e8jk"/>
              </div>
              <div className="space-y-2">
                <p className="text-[0.6875rem] tracking-widest uppercase text-outline">OUTERWEAR</p>
                <h3 className="font-bold text-sm tracking-tight">ARCHITECTURAL HOODIE / CHARCOAL</h3>
                <p className="text-xs font-medium text-on-surface-variant">$185.00</p>
              </div>
            </Reveal>

            {/* Product Card 2 */}
            <Reveal delay={0.2} className="bg-surface-container-lowest group cursor-pointer p-6">
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-surface-container">
                <img alt="premium white organic cotton t-shirt" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBtyd6it8MW0BLgNrWOJcnZx3PAEX2fa4DP44bDijjCZSeUdR2b4Lo1nUYSH_Ib8eGoQTwIvyesZzRxowM4fDIZspAUfqMmxsEsSnwg3jzOwuB3nBR12d5M3q2Qt1jQQGcYLWUbOkWi8sfwVlCsrGtKGUqxMsp_1xg13q7Q3KxhzWhkqB9gSbcnQW79XsNougHtXGwHiK7rVlPEVyAW4TiJ5RW3UiAjFZVmmYseu7OE2pLbLNqS_PxFBWzljurgyd_RYHb9UA4HNLY"/>
              </div>
              <div className="space-y-2">
                <p className="text-[0.6875rem] tracking-widest uppercase text-outline">TOPS</p>
                <h3 className="font-bold text-sm tracking-tight">ESSENTIAL BOX TEE / OPTIC WHITE</h3>
                <p className="text-xs font-medium text-on-surface-variant">$85.00</p>
              </div>
            </Reveal>

            {/* Product Card 3 */}
            <Reveal delay={0.3} className="bg-surface-container-lowest group cursor-pointer p-6">
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-surface-container">
                <img alt="technical black cargo pants" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRHPa6Lwk-f4RMG_8tqMxMeNaw4lSCkqQaV4QdZrdmOqLRTt_3GB3XZ00VoFlqNJwohODfwzaqlZ-SQeV0Hm8-7HhPQ9T4xQoUWe7kErKmAM-wZL9BsDITuA6HUvURg3VOpTfbJHEDPokYn6FjZG0dD0CZIJgPcBtOEeVXCZAkAMThmBY7DyHFabl_cGyYU9342pSk49rZFzN5ioNtoA21i1ZvdO64EDcQAD6i4YcOW153AjWh2flt67JJMsqiPjDuWnh-ICWQFOrd"/>
              </div>
              <div className="space-y-2">
                <p className="text-[0.6875rem] tracking-widest uppercase text-outline">BOTTOMS</p>
                <h3 className="font-bold text-sm tracking-tight">STRUCTURAL CARGO PANTS / NOIR</h3>
                <p className="text-xs font-medium text-on-surface-variant">$240.00</p>
              </div>
            </Reveal>

            {/* Product Card 4 */}
            <Reveal delay={0.4} className="bg-surface-container-lowest group cursor-pointer p-6">
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-surface-container">
                <img alt="beige heavyweight sweatshirt" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBAfdxCuFDFg2nC84fDF8gEQdI6h32R2ZvcYBi8Fo0Xme7rFqc61Et2HD2ezm80qxcIQhaG9EFUv69HD7hUaaytU3EdHnhs9F37WTEaEUFMxLqfpKRORvBiqMSLLFFssD8Rq-jB1axuJdcLdJfVQ0nUubFL3him_PLboWVUz7nZ_eCaGRnozBcBxa34YjVZ6i_rer_xfYZcFuWGO5OtA-dTdRdghA2ZDU9Gt8yYXDiaTufSKVRF9cp9pawK6wZsatT8QiRPBlTB69i"/>
              </div>
              <div className="space-y-2">
                <p className="text-[0.6875rem] tracking-widest uppercase text-outline">OUTERWEAR</p>
                <h3 className="font-bold text-sm tracking-tight">SCULPTED SWEATSHIRT / SAND</h3>
                <p className="text-xs font-medium text-on-surface-variant">$160.00</p>
              </div>
            </Reveal>
          </div>
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
              <img alt="lifestyle urban gallery streetwear" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh0eCQWcJLI_RaE2OhZt4aMJ4enrfc8L-md_tZA4ZodK6M1_ON2X0U5YJ7SsowZH9NHVfSyCS5QXP1KpNuKztpWLn1ofQA6PpIIE_HHpbKEiU4enx6at5xjWihC6kxTUnDGsqckU2_zMMyaIDQtlCxFwJUuvw54Vlqs4vAKRUmZYsAlnYKshV9F-wAFHr2pHLiHquk559xYLfd0pJPyiRiUFX6WNjT1lsCAOPZXTJHqyTqbUlgM5t2FjvnsdqzfPYJJicUjLo6IXt8"/>
            </Reveal>
            <Reveal delay={0.3} className="aspect-[3/4] overflow-hidden bg-surface-container md:mt-12 group">
              <img alt="editorial fashion brutalist wall" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDDGzZQ3tRt0uyxcSIewtbRr1_Yut86w0ADHh6YhYL6CvZVfCfJhFlL1nDXL0kCm2h-kHlhjPFNth0zzRLqqOHnkEkuh28Xd0KOjQMklyGmtDvfPuLnDCcy7MMh8bAXbpXMA34CCYG3O_VsoD2iNAvLbrAheJ3e5oBd0DuOQXYIu-Yt-a1QV6p-GzBPfYIQori_TP5q6CMMArAlYSprBbY2d6Ba_KnPZtXpH-epdpYlb3I6TWVXKlFPl5t3LQnmkJtcHe-Lxn821ZA"/>
            </Reveal>
            <Reveal delay={0.5} className="aspect-[3/4] overflow-hidden bg-surface-container group">
              <img alt="street style technical gear" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChIHvtJUfTD1gewJX3_-WCVjEdvE3GZ2nA946f32jZD7RKUKJSWgCHOanh0Bpd9AAosA1bWJfniDaX6_LAV31921RhAIW_eRLiFyD0xOCdOjxxwjwEUsGHoYFtrAmC4773D4yuCmCFwaBoAY0NXUycPYQI3oPKIk3q0LP61QAvQbFmpR63p9WAGCexVQ9K5uzJP_G__almd9IdtZ8JvMMDxzuqg4ImvrqSpvnOjeZS-iyMElTZYWjSBSfUJdsGhD9kVPhucn9cazlX"/>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

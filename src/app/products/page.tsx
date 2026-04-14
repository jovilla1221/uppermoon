import Link from "next/link";

const products = [
  {
    name: "ARCHETYPE SHELL JACKET",
    price: 580.00,
    category: "TECHNICAL OUTERWEAR",
    slug: "archetype-shell-jacket",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJoizZcZPl-x4G086kQ0ND87_KQnfXJ_65Who43YyMyzq4g2V9y_Nx9sG-AgX8trbr7U20a2eCPAYqRQuywlDvs4WR_OGN4awx8YIC_5RJebXeTMpjaNj2PkkozWX4wRHsPur9-IhXFdaSGPKvXd5ouCpAPIVfO7NgcJvzt8MjG-epS-VQOdUrM-A4dRVc_BeUzAcKvQbbF_m91QLNzOIZz_Cg9Xh0xeUELRbPajR9JtHzPir8o-Acxrvqc42ddjbr6dPOhfx0JXhu"
  },
  {
    name: "MONOLITH HOODIE - CHALK",
    price: 225.00,
    category: "HEAVYWEIGHT JERSEY",
    slug: "monolith-hoodie-chalk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_uZG4IPmqqsEacv20Bhw6kXGZNM25iHsrNzqMJ5jcM-78KGZIp6KEAN0h5JNlA8fQJLqOx8rfBhLcOiJIdFU2KmtalUMcUOgiKIioA8w5XkVxT0Hp6TiJCIivJwKYFktYtJHAaeDnyJSkJR6cTLKaTnNg8skF4IEOY2LZMYCSEarSpidCkmnBRkPH862ve2OVjKYtfmzqCfkpiTkH0UuLFzR6PypvpJIpKw9oaMrC4EqNV1-N5diVt8s0kiNxeYXcRza1FcsFopQM"
  },
  {
    name: "LINEAR WOOL TROUSERS",
    price: 340.00,
    category: "BOTTOMS",
    slug: "linear-wool-trousers",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsQ00Wm2vAhvuyuIGaghTInXumFAtMIopKsLpPcUpAUgLvuKgE6EM8hpr1UQ_qOOdNJm6EHVgSIXeCJHYLun16AvBzcTMBwDvrki44xuC88mRhhsBmkx0pyAqWnrg0Q8EYwHRnjHOA7Q-drebckPPDeeLcEq0CFq1XA7PaiWya-6R37RqRu1o6rVLHBUZ7C4RrIHnYxgNEDZgUmWiMzbe5s82iDJ0YJueMPwQPg2TGsWEyqf8my40WmISYYYHmzDnBGLJm1s35s5Dh"
  },
  {
    name: "VOID RUNNER SNEAKER 01",
    price: 410.00,
    category: "FOOTWEAR",
    slug: "void-runner-sneaker-01",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATYyV6rR_FgRY4lCVoEkUIg6pUddozYKIhgRVAw29cKu0sIqrGPEJ0AMiREQa3PWvobR-bGOP90gm_DzhC65bvTBXjjh4RJ4YJdCgxtKoRarSoVFOnlKzMlENhUbke4rlT4deLflOyHRSt6VUK6ahpMtROO71rAd5xz08FZGwcNctqPn43wizqoDEzZCKExgCrIpDV00rwEPDRBd5D3p7DVopciZBWG0eUTKyFEKj59YhYjsmgXJ9CoXBaa7jxXR0PCX1YWz0eBgz3"
  },
  {
    name: "ESSENTIAL BOX TEE",
    price: 85.00,
    category: "TOPS",
    slug: "essential-box-tee",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3Vr8K7g38HOyiUkjYq2dk0yCerpUJFenq3jydidclVOmjdFfBx5FSBpT2GV3mphI6LxqoyllA-jOiq-mvHZdikD4eD7RF9fQ4S415l9IaCHrNKEXuJAQG1DpLVU6KXBYpeCpuhGaeEQsOx1ucaVHb5W72I2gFDXzaXW6J3FGRprTk02rt_JaV3SxTvnS1IEEAJxe4Z_AUsivgqHBhAGngzzNB5-RBLr1LN9yLcLAJMpu-3l78EgBpQUhg-1tctdEM7jOpcqkWWGJ_"
  },
  {
    name: "UTILITY CARGO SYSTEM",
    price: 320.00,
    category: "BOTTOMS",
    slug: "utility-cargo-system",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFf8xQwu2Y6wJRvKy8RJ7X7NX3uhvojCx6gq6T6kmd6Rw2DVYH0Xdk0T_R_zbG5ZEDYpHxNmxfN2x6TvAxphFJoAD8YN0_dO163aWH1QQzjp5ejIUUEzDk3hA0hgg6r6kvuqsXcFlyp505o7bcjxhzOHmQ4rGhVNP0x8rbR9qe2ck0ff1wuDJQBVT4GKlJYI_kVmZtdbySk4GDvANnRfUaWW3jTj6t080yV4wDg_UOSvC-dBc3fZzfp1HpD5P-rQn5wzsZoAsal4vQ"
  },
  {
    name: "OBSIDIAN OVERCOAT",
    price: 890.00,
    category: "OUTERWEAR",
    slug: "obsidian-overcoat",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG2QINlZK66iMmDoFqvDqKyJUJeg1wHJVK0iPpqORWoZQzpo4siy7hbV_a5iworLxQOzhLqtY408wpM6CS8w6q4PCJXdVfdfz-5JXWUQI9ulm3dSA138lXQ-r_WuQPgbjNUsch9AzS-hFy9LPDnP4i75BWMMtiTSv_nqyqBHN7N2w2PQw2bh4WUFF-UWyFckL549diPWF3zDQsxbm9dCWySaMb9P4UmcjGLXvFQj3p_Idox4H0Zua-34rNh04txiyNVgH1V4xLpmDV"
  },
  {
    name: "STRUCTURAL LEATHER TOTE",
    price: 450.00,
    category: "ACCESSORIES",
    slug: "structural-leather-tote",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNSJtY5xYF5AoBEJtI67YQ4IgsobybrTwqK5ucMUog-pz-ueV1mHjg--QSUMZRT87d68i62QkxmEnZd5O0Wn4eaFCU3xNJ6Mx3NK7nqtajawIUMkLPtARm4XIZoUqWugLKNb2fhQyoq7v-gzZJMKltNmUVVNgjTqFcpS0eGxq8v1L21-nPFOjHSl5Vli-zCfXmel2Jtjkv2k4ckI_DllQPJ6XluLBasPrjBhkgOtRSpxAw6huEi5j5hJIrC4ToqMqOrLhzxOyXVgp6"
  }
];

export default function ProductsPage() {
  return (
    <main className="flex min-h-screen bg-surface animate-[fade-up-slide_0.6s_forwards]">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col p-8 w-80 bg-surface border-r border-surface-container sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto">
        <div className="mb-12">
          <h2 className="text-xl font-black text-on-surface font-headline italic mb-1 uppercase">SHOP</h2>
          <p className="text-[10px] tracking-widest text-outline uppercase">CURRENCY: USD</p>
        </div>

        <nav className="flex flex-col space-y-6">
          <Link href="/products" className="flex items-center gap-3 text-on-surface border-l-4 border-black pl-4 font-label tracking-[0.1em] uppercase transition-all duration-150">
            <span className="material-symbols-outlined">arrow_forward</span>
            VIEW ALL
          </Link>
          <Link href="#" className="flex items-center gap-3 text-secondary pl-4 font-label tracking-[0.1em] uppercase hover:bg-surface-container-low transition-all duration-150">
            <span className="material-symbols-outlined">layers</span>
            OUTERWEAR
          </Link>
          <Link href="#" className="flex items-center gap-3 text-secondary pl-4 font-label tracking-[0.1em] uppercase hover:bg-surface-container-low transition-all duration-150">
            <span className="material-symbols-outlined">checkroom</span>
            TOPS
          </Link>
          <Link href="#" className="flex items-center gap-3 text-secondary pl-4 font-label tracking-[0.1em] uppercase hover:bg-surface-container-low transition-all duration-150">
            <span className="material-symbols-outlined">straighten</span>
            BOTTOMS
          </Link>
          <Link href="#" className="flex items-center gap-3 text-secondary pl-4 font-label tracking-[0.1em] uppercase hover:bg-surface-container-low transition-all duration-150">
            <span className="material-symbols-outlined">watch</span>
            ACCESSORIES
          </Link>
        </nav>

        <div className="mt-auto pt-12 space-y-10">
          <section>
            <h3 className="text-[11px] font-bold tracking-[0.2em] mb-6 uppercase text-on-surface">FILTER BY SIZE</h3>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button 
                  key={size}
                  className={`w-10 h-10 border flex items-center justify-center text-[10px] font-bold transition-colors ${size === 'M' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant/30 hover:bg-primary hover:text-on-primary'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-bold tracking-[0.2em] mb-6 uppercase text-on-surface">PRICE RANGE</h3>
            <div className="space-y-4">
              <input type="range" min="0" max="1000" className="w-full accent-black h-1 bg-surface-container cursor-pointer" />
              <div className="flex justify-between text-[10px] font-medium tracking-tighter">
                <span>$0</span>
                <span>$1,000+</span>
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* Product Grid Content */}
      <div className="flex-1">
        {/* Header & Breadcrumbs */}
        <header className="px-8 pt-12 pb-8 border-b border-surface-container sticky top-[80px] bg-surface/90 backdrop-blur-md z-40">
          <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-outline mb-6">
            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-colors">SHOP</Link>
            <span>/</span>
            <span className="text-primary font-bold">VIEW ALL</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-headline tracking-tighter leading-none italic">View All<span className="not-italic opacity-20">.</span></h1>
            <div className="flex items-center gap-4 text-[10px] tracking-widest font-bold">
              <span className="text-outline">SORT BY:</span>
              <select className="bg-transparent border-none p-0 focus:ring-0 uppercase tracking-widest text-[10px] font-bold cursor-pointer text-on-surface">
                <option>NEWEST</option>
                <option>PRICE LOW-HIGH</option>
                <option>PRICE HIGH-LOW</option>
              </select>
            </div>
          </div>
        </header>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`} className="group relative bg-surface border-r border-b border-surface-container overflow-hidden block">
              <div className="aspect-[4/5] bg-surface-container overflow-hidden relative">
                <img 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0" 
                  src={product.image}
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 translate-y-16 group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-primary text-on-primary py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors shadow-xl">
                    VIEW DETAILS
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xs font-bold tracking-tight uppercase line-clamp-1 pr-4">{product.name}</h3>
                  <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors hover:fill-current">favorite</span>
                </div>
                <p className="text-[10px] tracking-[0.1em] text-outline uppercase mb-2">{product.category}</p>
                <p className="text-sm font-medium text-on-surface">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="py-16 flex justify-center border-b border-surface-container">
          <div className="flex items-center gap-8 md:gap-12">
            <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">arrow_back</button>
            <div className="flex items-center gap-4 md:gap-6">
              <span className="text-[10px] font-bold tracking-widest text-primary border-b-2 border-primary pb-1">01</span>
              <span className="text-[10px] font-bold tracking-widest text-outline hover:text-primary cursor-pointer pb-1 transition-colors">02</span>
              <span className="text-[10px] font-bold tracking-widest text-outline hover:text-primary cursor-pointer pb-1 transition-colors">03</span>
              <span className="text-[10px] font-bold tracking-widest text-outline">...</span>
              <span className="text-[10px] font-bold tracking-widest text-outline hover:text-primary cursor-pointer pb-1 transition-colors">12</span>
            </div>
            <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">arrow_forward</button>
          </div>
        </div>
      </div>
    </main>
  );
}

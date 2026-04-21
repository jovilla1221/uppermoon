import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-headline",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

import { AuthProvider } from "@/context/AuthContext";
import { siteSettingsQuery, allProductsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "UPPERMOON | Architectural Silence",
  description: "Minimalist urban aesthetic streetwear.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings: any = null;
  let products: any[] = [];
  try {
    settings = await client.fetch(siteSettingsQuery, {}, { next: { revalidate: 60 } });
  } catch (e) { }

  try {
    products = await client.fetch(allProductsQuery, {}, { next: { revalidate: 60 } });
  } catch (e) { }

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${inter.variable} ${notoSerif.variable} antialiased bg-surface text-on-surface`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <Navbar logoUrl={settings?.logo || ""} products={products} />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

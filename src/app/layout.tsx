import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
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

import { siteSettingsQuery } from "@/sanity/lib/queries";
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
  try {
    settings = await client.fetch(siteSettingsQuery, {}, { next: { revalidate: 60 } });
  } catch (e) { }

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${notoSerif.variable} antialiased bg-surface text-on-surface`}
        suppressHydrationWarning
      >
        <CartProvider>
          <Navbar logoUrl={settings?.logo || ""} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

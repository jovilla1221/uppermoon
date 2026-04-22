import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-headline",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

import { AuthProvider } from "@/context/AuthContext";
import { siteSettingsQuery, allProductsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Architectural Silence`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "streetwear", "minimalist fashion", "urban clothing", "Indonesian streetwear",
    "premium clothing", "UPPERMOON", "architectural fashion", "Blitar",
    "kaos streetwear", "jaket hoodie", "fashion brand Indonesia"
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Architectural Silence`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | Architectural Silence`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
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
    <html lang="id" className="light" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased bg-surface text-on-surface`}
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

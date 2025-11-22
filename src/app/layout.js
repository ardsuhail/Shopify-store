import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { AppProvider } from "@/component/Context";
import NavSidebar from "@/component/NavSidebar";
import Cart from "@/component/Cart";
import SessionWrapper from "@/component/SessionWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.shopovix.store"),
  title: {
    default: "Shopovix – Premium Online Store | Best Deals, Fast Delivery",
    template: "%s | Shopovix"
  },
  description:
    "Shopovix is your one-stop online store for premium, trending, and high-quality products. Enjoy secure checkout, fast shipping, easy returns, and 24/7 support.",
  keywords: [
    "Shopovix",
    "online shopping",
    "best deals",
    "premium store",
    "fast delivery",
    "ecommerce",
    "trending products",
    "affordable price",
    "online store India"
  ],
  authors: [{ name: "Shopovix Team" }],
  creator: "Shopovix",
  publisher: "Shopovix Store",
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
  alternates: {
    canonical: "https://www.shopovix.store",
  },
  openGraph: {
    title: "Shopovix – Premium Online Store | Quality Products at Best Price",
    description:
      "Discover premium quality products at Shopovix. Safe checkout, fast shipping, and a trusted shopping experience.",
    url: "https://www.shopovix.store",
    siteName: "Shopovix",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Shopovix Online Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopovix – Premium Online Store",
    description:
      "Shopovix brings trending products at affordable prices with fast delivery and easy returns.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
        <AppProvider>
        <Navbar/>
          <NavSidebar/>
          <Cart/>
        {children}
        <Footer/>
        </AppProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}

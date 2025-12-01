import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { AppProvider } from "@/component/Context";
import NavSidebar from "@/component/NavSidebar";
import Cart from "@/component/Cart";
import Script from "next/script";
import SessionWrapper from "@/component/SessionWrapper";
import TrackingWrapper from "@/component/TrackingWrapper";
import dynamic from "next/dynamic";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// const Tracking = dynamic(() => import('@/component/Tracking'), { ssr: false });

export const metadata = {
  metadataBase: new URL("https://www.shopovix.store"),

  title: {
    default: "Shopovix – India’s Trusted Online Store | Premium Quality, Best Prices",
    template: "%s | Shopovix"
  },

  description:
    "Shopovix – is India’s most trusted online shopping destination for premium-quality products at unbeatable prices. Enjoy secure checkout, fast delivery across India, hassle-free returns, 24/7 support, and a seamless shopping experience you can rely on.",

  keywords: [
    "Shopovix",
    "online shopping India",
    "best price online store",
    "premium products India",
    "fast delivery shopping",
    "trusted online store",
    "best deals in India",
    "ecommerce India",
    "secure checkout shopping",
    "Shopovix products"
  ],

  authors: [{ name: "Shopovix Team" }],
  creator: "Shopovix",
  publisher: "Shopovix",

  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },

  alternates: {
    canonical: "https://www.shopovix.store",
  },

  openGraph: {
    title: "Shopovix – Premium Online Store | Fast Delivery • Secure Checkout • Best Deals",
    description:
      "Shop smarter with Shopovix. Discover top‑quality products, lightning‑fast delivery, secure payments, and worry‑free returns. Trusted by customers across India.",
    url: "https://www.shopovix.store",
    siteName: "Shopovix – India’s Trusted Online Store",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Shopovix – India's Premium Online Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shopovix – Premium Products, Fast Delivery, Trusted by India",
    description:
      "Shopovix brings premium-quality products at unbeatable prices. Secure checkout, fast shipping, and 24/7 customer support.",
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

  other: {
    "facebook-domain-verification": "gli3gp6h5thw6tnq36vjz6ytmtnfe1",
  }
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
     
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
  id="fb-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '${process.env.NEXT_PUBLIC_PIXEL_ID}');
      fbq('track', 'PageView');
    `,
  }}
/>

        <SessionWrapper>
        <AppProvider>
          {/* <Tracking/> */}
        <Navbar/>
          <NavSidebar/>
          <Cart/>
          <TrackingWrapper/>
        {children}
        <Footer/>
        </AppProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}

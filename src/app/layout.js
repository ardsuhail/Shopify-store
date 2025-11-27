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

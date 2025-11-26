"use client";

import { useEffect } from "react";

export default function PixelViewContent({ product }) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        content_ids: [product._id],
        content_name: product.title,
        value: product.variants?.[0]?.price || product.price,
        currency: "INR",
      });
    }
  }, []);

  return null; // UI me kuch render nahi karega
}

import { getProductById } from "@/server/actions/getProductById";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    console.log("Fetching product with ID:", productId);

    const product = await getProductById(productId);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Transform Shopify product to match frontend expectations
    const transformedProduct = {
      id: product.id,
      title: product.title,
      name: product.title,
      description: product.body_html,
      handle: product.handle,
      price: product.variants?.[0]?.price || 0,
      image: product.images?.[0]?.src || null,
      images: product.images || [],
    };

    return NextResponse.json({ success: true, product: transformedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error in getProduct API:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const shopifyResponse = await fetch(
      `https://${process.env.MY_STORE}/admin/api/2024-10/orders.json?customer_id=${customerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
        },
      }
    );

    const data = await shopifyResponse.json();

    if (!shopifyResponse.ok) {
      return NextResponse.json({ error: data.errors || "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orders: data.orders || [],
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

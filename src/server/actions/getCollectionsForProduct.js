"use server";

const STORE = process.env.MY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;

export async function getCollectionsForProduct(productId) {
  try {
    if (!productId) return [];
    console.log("🧭 Fetching collections for product:", productId);

    const res = await fetch(
      `https://${STORE}/admin/api/2025-07/collects.json?product_id=${productId}`,
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch collects for product:", res.status);
      return [];
    }

    const data = await res.json();
    const collectionIds = (data.collects || []).map((c) => c.collection_id).filter(Boolean);
    console.log("🔎 Collections found for product:", collectionIds);
    return collectionIds;
  } catch (err) {
    console.error("Error fetching collections for product:", err);
    return [];
  }
}

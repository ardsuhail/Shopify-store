"use server";

const STORE = process.env.MY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;
async function getCollections() {
  try {
    const res = await fetch(`https://${STORE}/admin/api/2025-07/custom_collections.json`, {
      headers: {
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Failed to fetch collection:", res.status);
      return []; // fallback empty array
    }

    const data = await res.json();
    
    return data.custom_collections || []; // fallback agar products undefined ho
  } catch (err) {
    console.error("Error fetching collections:", err);
    return []; // fallback
  }
}

export { getCollections };
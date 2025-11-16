"use server";

const STORE = process.env.MY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;

// Ye sirf featured collection ke products fetch karega
async function getFeaturedProducts() {
  try {
    // Step 1: Pehle saari collections lao
    const res = await fetch(`https://${STORE}/admin/api/2025-07/custom_collections.json`, {
      headers: {
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Failed to fetch collections:", res.status);
      return [];
    }

    const data = await res.json();

    // Step 2: Featured collection find karo
    const featuredCollection = data.custom_collections.find(
      (col) => col.title.toLowerCase() === "featured collection"
    );

    if (!featuredCollection) {
      console.error("Featured collection not found!");
      return [];
    }

    const featuredId = featuredCollection.id;

    // Step 3: Is collection ke products ke IDs fetch karo
    const collectsRes = await fetch(
      `https://${STORE}/admin/api/2025-07/collects.json?collection_id=${featuredId}`,
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    const collectsData = await collectsRes.json();
    const productIds = collectsData.collects.map((c) => c.product_id);

    if (productIds.length === 0) {
      console.log("No products in featured collection!");
      return [];
    }

    // Step 4: Product details lao
    const productsRes = await fetch(
      `https://${STORE}/admin/api/2025-07/products.json?ids=${productIds.join(",")}`,
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    const productsData = await productsRes.json();

    return productsData.products || [];
  } catch (err) {
    console.error("Error fetching featured products:", err);
    return [];
  }
}

export { getFeaturedProducts };

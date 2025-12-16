"use server";

const STORE = process.env.MY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;

async function getTrendingProducts() {
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
    const trendingProducts = data.custom_collections.find(
      (col) => col.title.toLowerCase() === "trending products"
    );

    if (!trendingProducts) {
      console.error("trending products not found!");
      return [];
    }

    const trendingProductsID = trendingProducts.id;

    // Step 3: Is collection ke products ke IDs fetch karo
    const collectsRes = await fetch(
      `https://${STORE}/admin/api/2025-07/collects.json?collection_id=${trendingProductsID}`,
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
      // console.log("No products in featured collection!");
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
    console.error("Error fetching trending products:", err);
    return [];
  }
    

}

export default getTrendingProducts;
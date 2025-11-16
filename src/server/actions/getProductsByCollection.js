"use server";

const STORE = process.env.MY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;

export async function getProductsByCollection(collectionId) {
    try {
        console.log("🛒 Fetching products for collection ID:", collectionId);

        // Step 1: Get product IDs in this collection using collects endpoint
        const collectsRes = await fetch(
            `https://${STORE}/admin/api/2025-07/collects.json?collection_id=${collectionId}`,
            {
                headers: {
                    "X-Shopify-Access-Token": TOKEN,
                    "Content-Type": "application/json",
                },
                next: { revalidate: 0 },
            }
        );

        if (!collectsRes.ok) {
            console.error("Failed to fetch collects:", collectsRes.status);
            return [];
        }

        const collectsData = await collectsRes.json();
        const productIds = collectsData.collects.map((c) => c.product_id);

        if (productIds.length === 0) {
            console.log("No products in this collection!");
            return [];
        }

        // Step 2: Get full product details including variants and prices
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

        if (!productsRes.ok) {
            console.error("Failed to fetch products:", productsRes.status);
            return [];
        }

        const productsData = await productsRes.json();
        console.log("📦 Products with prices:", productsData.products);
        
        return productsData.products || [];
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return [];
    }
}
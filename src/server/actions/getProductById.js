// server/actions/getProductById.js
export async function getProductById(productId) {
    try {
        console.log("🔍 Fetching product by ID:", productId);
        console.log("🏪 Domain:", process.env.MY_STORE);
        console.log("🔑 Token exists:", !!process.env.SHOPIFY_TOKEN);

        const DOMAIN = process.env.MY_STORE
        const TOKEN = process.env.SHOPIFY_TOKEN

        console.log("🎯 Final Domain:", DOMAIN);
        console.log("🎯 Final Token:", TOKEN ? "Exists" : "Missing");

        if (!DOMAIN || !TOKEN) {
            console.error('❌ Missing environment variables:', {
                domain: DOMAIN,
                token: TOKEN
            });
            return null;
        }

        const url = `https://${DOMAIN}/admin/api/2025-07/products/${productId}.json`;
        console.log("🌐 Request URL:", url);

        const res = await fetch(url, {
            headers: {
                'X-Shopify-Access-Token': TOKEN,
                'Content-Type': 'application/json'
            },
            cache: 'no-store' // Use this instead of next: { revalidate: 0 }
        })

        console.log("📡 Response Status:", res.status);
        console.log("📡 Response OK:", res.ok);

        if (!res.ok) {
            const errText = await res.text();
            console.error("❌ API Error:", errText);
            throw new Error(`Shopify API error ${res.status}: ${errText}`);
        }

        const data = await res.json();
        console.log('📦 FULL response from Shopify:', data);
        console.log('🎯 Product data:', data.product);
        
        return data.product || null;
    } catch (error) {
        console.error('❌ Error fetching product by ID:', error);
        return null;
    }
}
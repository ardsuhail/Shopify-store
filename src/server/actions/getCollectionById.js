// server/actions/getCollectionById.js
export async function getCollectionById(collectionId) {
    try {
        // console.log("🔍 Fetching collection by ID:", collectionId);

        // Call Shopify Admin API directly from the server action to avoid depending on internal API routes
        const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || process.env.MY_STORE
        const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_TOKEN

        if (!DOMAIN || !TOKEN) {
            console.error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ACCESS_TOKEN environment variables')
            return null
        }

        const res = await fetch(`https://${DOMAIN}/admin/api/2025-07/collections/${collectionId}.json`, {
            headers: {
                'X-Shopify-Access-Token': TOKEN,
                'Content-Type': 'application/json'
            },
            // avoid caching during development
            next: { revalidate: 0 }
        })

        if (!res.ok) {
            console.error('Failed to fetch collection from Shopify:', res.status)
            return null
        }

        const data = await res.json()
        // console.log('📦 Collection data from Shopify:', data)
        return data.collection || null
    } catch (error) {
        console.error('❌ Error fetching collection by ID:', error)
        return null
    }
}
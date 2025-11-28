export async function GET(request, { params }) {
    try {
        const { id } = params;


        // Shopify API call
        const response = await fetch(
            `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/collections/${id}.json`,
            {
                headers: {
                    'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Shopify API error: ${response.status}`);
        }

        const data = await response.json();
        return Response.json({ collection: data.collection });
    } catch (error) {
        console.error("🔴 API Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
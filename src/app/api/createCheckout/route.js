import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { variantId, quantity } = await req.json()

    // Use the Storefront Cart API (cartCreate) instead of checkoutCreate which
    // may not be present in some Storefront API versions. cartCreate accepts
    // an input with `lines`, each line uses `merchandiseId` (the variant gid).
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    // Shopify Storefront API expects a global id (gid) for the variant. Convert
    // numeric variant ids to the gid form if needed.
    const variantGid = String(variantId).startsWith('gid://')
      ? variantId
      : `gid://shopify/ProductVariant/${variantId}`;

    const variables = {
      input: {
        lines: [{ merchandiseId: variantGid, quantity: parseInt(quantity) }]
      }
    }

    console.log('Using store:', !!process.env.MY_STORE, 'Storefront token present:', !!process.env.SHOPIFY_STOREFRONT_TOKEN)
    const res = await fetch(`https://${process.env.MY_STORE}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({ query, variables })
    })

    const data = await res.json()
    console.log('Shopify checkoutCreate response:', JSON.stringify(data, null, 2))

    const cart = data?.data?.cartCreate?.cart
    const checkoutUrl = cart?.checkoutUrl

    if (!checkoutUrl) {
      // Return detailed information to the client for debugging (will be removed/trimmed in prod)
      return NextResponse.json({ success: false, message: 'Checkout creation failed', shopify: data })
    }

    return NextResponse.json({ success: true, url: checkoutUrl })
  } catch (error) {
    console.error('Checkout Error:', error)
    return NextResponse.json({ success: false, message: error.message })
  }
}

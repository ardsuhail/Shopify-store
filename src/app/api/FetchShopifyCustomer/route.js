import connectDB from "@/db/connectDB";
import User from "@/model/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectDB();

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Shopify Admin API call to get customer by email
    const shopifyRes = await fetch(`https://${process.env.MY_STORE}/admin/api/2024-10/customers/search.json?query=email:${email}`, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN
      }
    });

    const data = await shopifyRes.json();
    const shopifyCustomerId = data.customers?.[0]?.id;

    if (!shopifyCustomerId) return res.status(404).json({ message: "Shopify customer not found" });

    // Update MongoDB user
    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { shopifyCustomerIds: shopifyCustomerId.toString() } }, // add without duplicates
      { new: true, upsert: true } // create user if doesn't exist
    );

    res.status(200).json({ message: "Shopify customer ID fetched and stored", shopifyCustomerId, user });
  } catch (error) {
    console.error("Error fetching Shopify customer:", error);
    res.status(500).json({ message: error.message });
  }
}

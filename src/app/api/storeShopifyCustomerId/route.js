import connectDB from "@/db/connectDB";
import User from "@/model/User";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectDB();

    const { googleEmail, shopifyCustomerId } = req.body;

    if (!googleEmail || !shopifyCustomerId)
      return res.status(400).json({ message: "Missing fields" });

    // Find logged-in user
    const user = await User.findOne({ email: googleEmail });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Add Shopify ID (avoid duplicates)
    if (!user.shopifyCustomerIds.includes(shopifyCustomerId)) {
      user.shopifyCustomerIds.push(shopifyCustomerId);
      await user.save();
    }

    res.status(200).json({ message: "Shopify ID stored", shopifyCustomerIds: user.shopifyCustomerIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

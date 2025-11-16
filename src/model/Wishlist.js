import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user ka reference
      required: true,
    },
    email: { type: String, required: true },
    products: [
      {
        type: String, // Shopify product ID (gid or numeric string)
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);

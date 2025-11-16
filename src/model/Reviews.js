import mongoose from "mongoose";
import { getProductById } from "@/server/actions/getProductById";
const ReviewsSchema = new mongoose.Schema({
  // ProductId: { type: mongoose.Schema.Types.ObjectId,  required: true },
  ProductId: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String ,required: true},
  rating: { type: Number, min: 1, max: 5, required: true },
  desc: { type: String },
  images: [String], // Uploaded images URLs
  // videos: [String], // Uploaded video URLs
}, { timestamps: true });

export default mongoose.models.Reviews || mongoose.model("Reviews", ReviewsSchema);

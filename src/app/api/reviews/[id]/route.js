import Reviews from "@/model/Reviews";
import connectDB from "@/db/connectDB";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params;
  try {
    const reviews = await Reviews.find({ProductId:id});
    if (!reviews) {
      return Response.json({ success: false, message: "Reviews not found" });
    }
    return Response.json({ success: true, reviews });
  } catch (error) {
    return Response.json({ success: false, message: "Server error" });
  }
}



export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!id) {
      return new Response(JSON.stringify({ success: false, message: "Review ID is required" }), { status: 400 });
    }
    const deleteReview = await Reviews.findByIdAndDelete(id);
    if (!deleteReview) {
      return new Response(JSON.stringify({ success: false, message: "Review not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, message: "Review deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

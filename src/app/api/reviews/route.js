import Reviews from "@/model/Reviews";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/db/connectDB";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req) {
    try {
        await connectDB()
        const formData = await req.formData()
        const ProductId = await formData.get("ProductId")
        const customerName = await formData.get("customerName")
        const userEmail = await formData.get("email")
        const rating = await formData.get("rating")
        const desc = await formData.get("desc")
        const images = await formData.getAll("images")
        const email = userEmail.toLowerCase();
        if (!customerName || !rating || !desc || !email) {
            return new Response(JSON.stringify({ success: false, message: "All fields are required" }), { status: 400 });
        }
        const uploadedImages = [];
        for (let file of images) {
            if (!file || !file.size) continue; // skip invalid files
            const buffer = Buffer.from(await file.arrayBuffer()); // only works if file is proper blob
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "shopovix-reviews" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(buffer);
            });
            uploadedImages.push(result.secure_url);
  
        }

        const newReviews = await Reviews.create({
            ProductId,
            customerName,
            email,
            rating,
            desc,
            images: uploadedImages,
        })
        return Response.json({
            success: true,
            error: false,
            message: "reviews submited successfulluy",
            reviews: newReviews
        })
    } catch (error) {
        return Response.json({
            success: false,
            error: true,
            message: "Server error please try again later"
        })
    }
}


export async function GET(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const email = url.searchParams.get('email'); // get email from query

        if (!email) {
            return NextResponse.json({
                success: false,
                error: true,
                message: "Email is required",
            }, { status: 400 });
        }

        const reviews = await Reviews.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
        return NextResponse.json({
            success: true,
            error: false,
            reviews
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: true,
            message: 'Server Error. Please Try Again',
        });
    }
}

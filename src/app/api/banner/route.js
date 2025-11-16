import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/db/connectDB";
import Banner from "@/model/Banner";
import { NextResponse } from "next/server";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        await connectDB();
        const formData = await req.formData();
        const image = formData.get("image");
        const linkUrl = formData.get("linkUrl");
        const altText = formData.get("altText");
        const position = formData.get("position");
        const isActive = formData.get("isActive");

        console.log("📥 FormData received:", {
            hasImage: !!image,
            imageType: image?.constructor?.name,
            imageSize: image?.size,
            altText,
            position,
            isActive
        });

        if (!image) {
            console.error("❌ No image file received");
            return NextResponse.json({
                success: false,
                message: "Please upload a valid image file",
            }, { status: 400 });
        }

        if (!altText?.trim()) {
            return NextResponse.json({
                success: false,
                message: "Alt text is required",
            }, { status: 400 });
        }

        console.log("✅ Image file is valid, uploading to Cloudinary...");
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "shopovix-banner", resource_type: "auto" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });

        const uploadedImageUrl = result.secure_url;

        const newBanner = await Banner.create({
            images: uploadedImageUrl,
            linkUrl: linkUrl || "",
            altText: altText.trim(),
            position: position || "top",
            isActive: isActive === "true" || isActive === true
        });

        return NextResponse.json({
            success: true,
            message: "Banner created successfully",
            banner: newBanner,
        });
    } catch (error) {
        console.error("Error creating banner:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create banner",
            error: error.message,
        }, { status: 500 });
    }
}


export async function GET() {
    try {
        await connectDB();
        const banners = await Banner.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, banner: banners });
    } catch (error) {
        console.error("Error fetching banners:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Failed to fetch banners", 
            error: error.message 
        }, { status: 500 });
    }
}

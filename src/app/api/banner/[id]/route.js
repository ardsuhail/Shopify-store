import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/db/connectDB";
import Banner from "@/model/Banner";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Banner ID is required"
            }, { status: 400 });
        }

        const banner = await Banner.findById(id);
        if (!banner) {
            return NextResponse.json({
                success: false,
                message: "Banner not found"
            }, { status: 404 });
        }

        return NextResponse.json({ success: true, banner }, { status: 200 });
    } catch (error) {
        console.error("Error fetching banner:", error);
        return NextResponse.json({
            success: false,
            message: "Server error",
            error: error.message
        }, { status: 500 });
    }
}

// ✅ PATCH route for updating banners
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Banner ID is required"
            }, { status: 400 });
        }

        const formData = await req.formData();
        const image = formData.get("image");
        const linkUrl = formData.get("linkUrl");
        const altText = formData.get("altText");
        const position = formData.get("position");
        const isActive = formData.get("isActive");

        console.log("Update data:", { id, hasImage: !!image, linkUrl, altText, position, isActive });

        // ✅ Find existing banner
        const existingBanner = await Banner.findById(id);
        if (!existingBanner) {
            return NextResponse.json({
                success: false,
                message: "Banner not found"
            }, { status: 404 });
        }

        let updatedFields = {
            linkUrl: linkUrl || existingBanner.linkUrl,
            altText: altText?.trim() || existingBanner.altText,
            position: position || existingBanner.position,
            isActive: isActive === "true" || isActive === true
        };

        // ✅ Only update image if new file is provided
        if (image && typeof image !== 'string') {
            const buffer = Buffer.from(await image.arrayBuffer());
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { 
                        folder: "shopovix-banner",
                        resource_type: "auto" 
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(buffer);
            });

            updatedFields.images = result.secure_url;
        }

        const updatedBanner = await Banner.findByIdAndUpdate(
            id, 
            updatedFields, 
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: "Banner updated successfully",
            banner: updatedBanner
        });

    } catch (error) {
        console.error("Error updating banner:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to update banner",
            error: error.message,
        }, { status: 500 });
    }
}

// ✅ DELETE route
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Banner ID is required"
            }, { status: 400 });
        }

        const deletedBanner = await Banner.findByIdAndDelete(id);
        
        if (!deletedBanner) {
            return NextResponse.json({
                success: false,
                message: "Banner not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Banner deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting banner:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete banner",
            error: error.message,
        }, { status: 500 });
    }
}
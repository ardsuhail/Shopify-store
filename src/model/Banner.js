import mongoose from "mongoose";

const BannerSchema=new mongoose.Schema({
    images: { type: String, required: true },
    linkUrl: { type: String },
    altText: { type: String, required: true },
    position: { type: String, enum: ['top', 'bottom', 'side'] },
    isActive: { type: Boolean, default: true },
},{ timestamps: true });

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
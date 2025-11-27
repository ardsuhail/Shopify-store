import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true, unique: true },
  ip: String,
  ua: String,
  referrer: String,
  url: String,
  utm: {
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    fbclid: String
  },
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);

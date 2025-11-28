// model/Event.js - Ensure this is correct
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  type: { type: String, required: true }, // Purchase, AddToCart, etc.
  payload: { type: Object, default: {} }, // product data, order info
  utm: {
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    utm_term: String,
    utm_content: String
  },
  fbclid: String,
 
},{timestamps:true});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  type: String, // AddToCart, InitiateCheckout, Purchase, etc.
  payload: Object, // arbitrary event meta (product ids, value)
  utm: Object,
  fbclid: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);

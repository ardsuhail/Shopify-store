import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  fullName: {
    type: String,
  },
  products: [
    {
      productId: String,
      quantity: Number,
      image: String,
      title: String,
      price: Number,
    }
  ],
  orderId: {
    type: String

  },
  customerName: String,
  customerAddress: String,
  razorpayOrderId: String,
  totalAmount: Number,
  email: String,
  shipment_id: {
    type: String,
    default: ""
  },
  awb_code: {
    type: String,
    default: ""
  },
  shiprocket_order_id: {
    type: String,
    default: ""
  },
  fbclid: { type: String, default: "" },
  utm_source: { type: String, default: "" },
  utm_medium: { type: String, default: "" },
  utm_campaign: { type: String, default: "" },
  paymentStatus: {
    type: String,
    default: "pending"
  },
  paymentMethod: {
    type: String,
    default: "COD"
  },
  orderStatus: {
    type: String,
    default: "processing"
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    enum: [
      "order-issue",
      "product-info",
      "shipping",
      "returns",
      "general",
      "wholesale",
    ], // same options as your select dropdown
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);

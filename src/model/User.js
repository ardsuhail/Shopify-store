import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   name: { type: String, required: true },
   username: { type: String },
   email: { type: String, required: true, unique: true },
   profilePicture: { type: String },
   phone: { type: String },
   gender: { type: String },
   dateOfBirth: { type: Date },
   address: {
     street: { type: String },
     city: { type: String },
     state: { type: String },
     zipCode: { type: String },
     country: { type: String },
   },
   googleUserId: { type: String, unique: true },  // ✅ Google login unique ID
   shopifyCustomerIds: { type: [String], default: [] } // ✅ Shopify customer ID(s)
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);

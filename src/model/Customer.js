import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    phone: {
        type: String, // ❌ Number se String karo
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    country: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    address: { // ❌ fullAddress ko address karo
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String, // ❌ Number se String karo
        required: true
    },
    oid: {
        type: String,
        default: "" // ❌ Required hatao
    },
    done: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
 
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true,
  },
  
  
 
 
},{ timestamps: true});

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);





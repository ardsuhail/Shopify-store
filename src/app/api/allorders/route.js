import Order from "@/model/Order";
import connectDB from "@/db/connectDB";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  try {
    // Sabhi orders ek hi query me lao aur product details populate karo
    const allorders = await Order.find()
      .sort({ createdAt: -1 })
      
 

    if (!allorders || allorders.length === 0) {
      return NextResponse.json({ success: false, message: "No orders found" });
    }

    // Return requests nikalne ke liye filter
    // const returnRequests = allorders.filter(order => order.returnStatus === "pending");

    return NextResponse.json({ success: true, allorders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

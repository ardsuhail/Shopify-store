import crypto from "crypto";
import Order from "@/model/Order";
import connectDB from "@/db/connectDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, paymentId, signature } = body;

    // ✅ Basic validation
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({
        success: false,
        message: "Missing payment details"
      }, { status: 400 });
    }

    // ✅ Signature verify karo
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json({ 
        success: false, 
        message: "Payment verification failed" 
      }, { status: 400 });
    }

    // ✅ Order find karo aur payment status update karo
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { 
        paymentStatus: "paid"
        // orderStatus same rahega - "processing"
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    // ✅ Simple success response
    return NextResponse.json({ 
      success: true, 
      message: "Payment successful",
      orderId: updatedOrder._id
    });

  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ 
      success: false, 
      message: "Payment verification failed" 
    }, { status: 500 });
  }
}
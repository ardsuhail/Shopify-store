import crypto from "crypto";
import Order from "@/model/Order";
import connectDB from "@/db/connectDB";
import { NextResponse } from "next/server";
import { sendTelegramMessage } from "../../../../utils/sendTeligram";
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { razorpay_order_id, paymentId, signature } = body;

    // ✅ Basic validation
    if (!razorpay_order_id || !paymentId || !signature) {
      return NextResponse.json({
        success: false,
        message: "Missing payment details"
      }, { status: 400 });
    }

    // ✅ Signature verify karo
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json({ 
        success: false, 
        message: "Payment verification failed" 
      }, { status: 400 });
    }



    // ✅ Order find karo aur payment status update karo
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { 
        paymentStatus: "paid"
        // orderStatus same rahega - "processing"
      },
      { new: true }
    );



if (!updatedOrder) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  }

  // Get product name from order
  const productName = updatedOrder.products
    .map(p => p.title)
    .join(", ");

  // 🔥 Ab yaha notification send hoga
  await sendTelegramMessage(`
    🛒 <b>NEW PAID ORDER RECEIVED</b>

    👤 Name: ${updatedOrder.customerName}
    📞 Phone: ${updatedOrder.phone}
    📦 Product: ${productName}
    💰 Amount: ₹${updatedOrder.totalAmount}
    🏠 Address: ${updatedOrder.customerAddress}

    ✔️ Payment Verified Successfully!
    🔥 Check admin panel now!
  `);
    
          

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
      orderId: updatedOrder.orderId
    });

  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ 
      success: false, 
      message: "Payment verification failed" 
    }, { status: 500 });
  }
}
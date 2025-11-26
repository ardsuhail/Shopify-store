import connectDB from "@/db/connectDB";
import Coupon from "@/model/Coupon";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    await connectDB();
    const { code, orderAmount } = await req.json();

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon!" }, { status: 404 });
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Coupon expired!" }, { status: 400 });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json({ error: `Minimum order ₹${coupon.minOrderAmount} required` }, { status: 400 });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      discount,
      finalAmount: orderAmount - discount
    });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

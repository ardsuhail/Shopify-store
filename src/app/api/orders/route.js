import Order from "@/model/Order";
import connectDB from "@/db/connectDB";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  await connectDB();

  try {
 
    const session = await getServerSession();
    

    if (!session || !session.user?.email) {
     
      return NextResponse.json({ success: false, message: "Please Sign In First" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();


    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {

      return NextResponse.json({ success: true, orders: [] });
    }


    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}




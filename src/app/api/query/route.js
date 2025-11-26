import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import CustomerQuery from "@/model/CustomerQuery";
import { connect } from "mongoose";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newMessage = await CustomerQuery.create(body);

    return NextResponse.json({
      success: true,
      message: "Your Query has been submitted successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving contact form:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}


export async function GET(req){
  try {
    await connectDB()
    const queries=await CustomerQuery.find().sort({createdAt: -1})
    return NextResponse.json({success:true,queries})
  } catch (error) {
      console.error("Error fetching queries:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }
  }

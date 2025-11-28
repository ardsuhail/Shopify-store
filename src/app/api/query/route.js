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



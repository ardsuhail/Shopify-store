import connectDB from "@/db/connectDB";
import Subscriber from "@/model/Subscriber";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();
        if (!email || !email.trim()) {
            return NextResponse.json({
                success: false,
                message: "Email is required",
            }, { status: 400 });
        }
        const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            return NextResponse.json({
                success: false,
                message: "This email is already subscribed",
            }, { status: 400 });
        }
        const newSubscriber = await Subscriber.create({ email: email.toLowerCase() });
        return NextResponse.json({
            success: true,
            message: "Subscribed successfully",
            subscriber: newSubscriber,
        }, { status: 201 });
    } catch (error) {
        console.error("Error subscribing:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 });
    }
}


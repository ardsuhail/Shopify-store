import connectDB from "@/db/connectDB";
import Wishlist from "@/model/Wishlist";
import User from "@/model/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// POST - Add to Wishlist
export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ success: false, message: "Please Sign In First" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    let wishlist = await Wishlist.findOne({ user: user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: user._id,
        email,
        products: [productId],
      });
    } else {
      if (!wishlist.email) wishlist.email = email;

      if (wishlist.products.some(p => p.toString() === productId)) {
        return NextResponse.json({ success: false, message: "Product already in wishlist" }, { status: 400 });
      }

      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populatedWishlist = await wishlist.populate("products");
    return NextResponse.json({ success: true, message: "Product added to wishlist", wishlist: populatedWishlist }, { status: 200 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}


// GET - Fetch Wishlist
export async function GET(req) {
  await connectDB();

  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Please Sign In First" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();


    const wishlist = await Wishlist.findOne({ email }).populate("products");

    if (!wishlist) {
      return NextResponse.json({ success: true, wishlist: [] });
    }

    return NextResponse.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Please Sign In First" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const email = session.user.email.toLowerCase();
    const wishlist = await Wishlist.findOne({ email });

    if (!wishlist) {
      return NextResponse.json({ success: false, message: "Wishlist not found" }, { status: 404 });
    }

    if (!wishlist.products.includes(productId)) {
      return NextResponse.json({ success: false, message: "Product not in wishlist" }, { status: 404 });
    }

    // Remove product from wishlist array
    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();

    const populatedWishlist = await wishlist.populate("products");

    return NextResponse.json({
      success: true,
      message: "Product removed successfully from your wishlist",
      wishlist: populatedWishlist
    }, { status: 200 });

  } catch (err) {
    console.error("Error removing product from wishlist:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

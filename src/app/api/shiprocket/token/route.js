import { NextResponse } from "next/server";
import { getShiprocketToken } from "../../../../../utils/shiprocket";
// import { getShiprocketToken } from "@/utils/shiprocket";

export async function GET() {
  const token = await getShiprocketToken();

  if (!token) {
    return NextResponse.json(
      { error: "Failed to generate Shiprocket token" },
      { status: 500 }
    );
  }

  return NextResponse.json({ token });
}

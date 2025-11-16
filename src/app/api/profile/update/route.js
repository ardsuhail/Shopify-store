import { NextResponse } from 'next/server'
import connectDB from '@/db/connectDB'
import User from '@/model/User'

export async function PATCH(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { email, formData } = body

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: formData },
      { new: true }
    )

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

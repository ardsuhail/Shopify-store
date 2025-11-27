import connectDB from "@/db/connectDB";
import Session from "@/model/Session";

export async function POST(req) {
  await connectDB();
  const { sessionId, url, ip, ua } = await req.json();
  if (!sessionId) return new Response(JSON.stringify({ success: false }), { status: 400 });

  const now = new Date();
  await Session.findOneAndUpdate(
    { sessionId },
    { $set: { lastSeen: now, url, ip, ua } },
    { upsert: true }
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

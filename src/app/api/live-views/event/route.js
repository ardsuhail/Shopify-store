import connectDB from "@/db/connectDB";
import Event from "@/model/Event";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { sessionId, type, payload = {}, utm = {}, fbclid = "" } = body;

  await Event.create({ sessionId, type, payload, utm, fbclid });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

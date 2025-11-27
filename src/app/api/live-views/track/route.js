import connectDB from "@/db/connectDB";
import Session from "@/model/Session";
import Visit from "@/model/Visit";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const {
    sessionId,
    url,
    title,
    referrer,
    utm = {},
    fbclid = "",
    ip = "",
    ua = ""
  } = body;

  const now = new Date();

  // Upsert session (create if not exists)
  await Session.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: { createdAt: now },
      $set: {
        ip,
        ua,
        referrer,
        url,
        "utm": utm,
        "utm.fbclid": fbclid,
        lastSeen: now
      }
    },
    { upsert: true, new: true }
  );

  // Save visit
  await Visit.create({
    sessionId, url, title, referrer, ip, ua, utm, fbclid, createdAt: now
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

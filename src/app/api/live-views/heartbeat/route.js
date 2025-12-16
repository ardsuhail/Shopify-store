// app/api/live-views/heartbeat/route.js
import connectDB from "@/db/connectDB";
import Session from "@/model/Session";

function getClientIP(req) {
  const vercelIP = req.headers.get('x-forwarded-for');
  if (vercelIP) {
    return vercelIP.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return '127.0.0.1';
}

export async function POST(req) {
  await connectDB();
  const { sessionId, url, ip: clientIPFromBody = "", ua } = await req.json();
  
  if (!sessionId) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }

  const now = new Date();
  const serverDetectedIP = getClientIP(req);
  const finalIP = clientIPFromBody || serverDetectedIP;

  // console.log('💓 Heartbeat for session:', sessionId, 'IP:', finalIP);

  await Session.findOneAndUpdate(
    { sessionId },
    { 
      $set: { 
        lastSeen: now, 
        url, 
        ip: finalIP, 
        ua 
      },
      $setOnInsert: {
        createdAt: now,
        sessionId
      }
    },
    { upsert: true, new: true }
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
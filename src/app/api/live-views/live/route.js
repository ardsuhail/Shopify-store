import connectDB from "@/db/connectDB";
import Session from "@/model/Session";

export async function GET(req) {
  await connectDB();
  const now = new Date();
  const threshold = new Date(now.getTime() - 25 * 1000); // active last 25s
  const active = await Session.find({ lastSeen: { $gte: threshold } }).lean();

  // optional aggregation: group by url
  const byUrl = active.reduce((acc, s) => {
    acc[s.url || "/"] = (acc[s.url || "/"] || 0) + 1;
    return acc;
  }, {});

  return new Response(JSON.stringify({
    count: active.length,
    active,
    byUrl
  }), { status: 200 });
}

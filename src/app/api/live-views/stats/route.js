import connectDB from "@/db/connectDB";
import Visit from "@/model/Visit";
import Event from "@/model/Event";
import Session from "@/model/Session";

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "7d"; // 7d, 30d, 90d, 365d
  const now = new Date();
  let start;

  if (range === "7d") start = new Date(now.getTime() - 7*24*3600*1000);
  else if (range === "30d") start = new Date(now.getTime() - 30*24*3600*1000);
  else if (range === "90d") start = new Date(now.getTime() - 90*24*3600*1000);
  else if (range === "365d") start = new Date(now.getTime() - 365*24*3600*1000);
  else start = new Date(now.getTime() - 7*24*3600*1000);

  // visits per day
  const visits = await Visit.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // unique sessions (visitors)
  const uniqueVisitors = await Visit.distinct("sessionId", { createdAt: { $gte: start } });

  // events count
  const events = await Event.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: "$type", count: { $sum: 1 } } }
  ]);

  return new Response(JSON.stringify({
    visits,
    uniqueVisitors: uniqueVisitors.length,
    events
  }), { status: 200 });
}

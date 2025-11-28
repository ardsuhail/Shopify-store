// app/api/live-views/event/route.js
import connectDB from "@/db/connectDB";
import Event from "@/model/Event";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('🎯 Event API received:', body);
    
    const { sessionId, type, payload = {}, utm = {}, fbclid = "" } = body;

    // Validate required fields
    if (!sessionId || !type) {
      console.log('❌ Missing required fields:', { sessionId, type });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "sessionId and type are required" 
      }), { status: 400 });
    }

    // Create event with ALL fields including createdAt
    const eventData = {
      sessionId, 
      type, 
      payload, 
      utm, 
      fbclid,
      createdAt: new Date() // Explicitly add createdAt
    };

    console.log('💾 Creating event with data:', eventData);

    const event = await Event.create(eventData);

    console.log('✅ Event created successfully:', event._id);

    return new Response(JSON.stringify({ 
      success: true,
      eventId: event._id,
      message: "Event tracked successfully"
    }), { status: 200 });

  } catch (error) {
    console.error('❌ Event API Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      details: "Check if Event model has all required fields"
    }), { status: 500 });
  }
}
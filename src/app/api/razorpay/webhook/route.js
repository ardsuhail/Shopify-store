import crypto from "crypto";

export async function POST(req) {
  const bodyStr = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(bodyStr)
    .digest("hex");

  if (expected !== signature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const data = JSON.parse(bodyStr);

  if (data.event === "payment.captured") {
    const { order_id, email, contact, amount } = data.payload.payment.entity;

    // CAPI purchase call
    await fetch(
      `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
              action_source: "server",
              event_source_url: "https://shopovix.store",
              user_data: {
                em: [email],
                ph: [contact],
              },
              custom_data: {
                currency: "INR",
                value: amount / 100,
              },
            },
          ],
          access_token: process.env.META_CAPI_TOKEN,
        }),
      }
    );
  }

  return new Response("OK");
}

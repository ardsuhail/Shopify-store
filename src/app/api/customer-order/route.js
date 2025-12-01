import Customer from "@/model/Customer";
import Order from "@/model/Order";
import connectDB from "@/db/connectDB";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { createShiprocketOrder } from "../../../../utils/shiprocket";
import Event from "@/model/Event";
// --- FACEBOOK CAPI for COD Purchase ---
import crypto from "crypto";
import { sendTelegramMessage } from "../../../../utils/sendTeligram";

async function sendCapiForCOD(order, body) {
  try {
    
    
    await connectDB();
    
    // Customer details get karo from Customer collection
    const customer = await Customer.findById(order.customer);
    
    if (!customer) {
      return;
    }



    const hashedEmail = crypto
      .createHash("sha256")
      .update(customer.email.trim().toLowerCase())
      .digest("hex");

    const hashedPhone = crypto
      .createHash("sha256")
      .update(customer.phone.trim())
      .digest("hex");

    console.log('💾 Creating event in database...');
    
    // Event create karo
    const eventData = {
      sessionId: order.orderId,
      type: "Purchase",
      payload: {
        orderId: order.orderId,
        amount: order.totalAmount,
        currency: "INR",
        paymentMethod: "COD",
        products: order.products,
        customerEmail: customer.email,
        customerPhone: customer.phone
      },
      utm: {
        utm_source: body.utm_source || "",
        utm_medium: body.utm_medium || "",
        utm_campaign: body.utm_campaign || ""
      },
      fbclid: body.fbclid || "",
      createdAt: new Date()
    };


    
    const event = await Event.create(eventData);


    // Facebook CAPI
    console.log('📤 Sending Facebook CAPI...');
    const capiResponse = await fetch(
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
                em: [hashedEmail],
                ph: [hashedPhone],
              },
              custom_data: {
                currency: "INR",
                value: order.totalAmount || body.totalAmount || 0,
              },
            },
          ],
          access_token: process.env.META_CAPI_TOKEN,
        }),
      }
    );

    const capiResult = await capiResponse.json();
    console.log("✅ COD Purchase CAPI Sent:", capiResult);

  } catch (err) {
    console.error("❌ CAPI Error COD:", err);
    console.error("Error details:", err.message);
  }
}
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    console.log("Received order data:", body);

    const { paymentMethod = "COD", ...rest } = body;
    const email = body.email?.toLowerCase();

    // ✅ Common validation for all fields
    const requiredFields = ['fullName', 'phone', 'email', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !body[field]?.trim());

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }
    
    // ✅ Create/Update Customer
    const customerData = {
      email,
      phone: body.phone.toString(), // ✅ String me convert
      country: body.country || "India",
      fullName: body.fullName,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode.toString(), // ✅ String me convert
    };

    const customer = await Customer.findOneAndUpdate(
      { email },
      customerData,
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    async function generateOrderId() {
  // Latest order find
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });

  let lastNumber = 1000; // default start number

  if (lastOrder?.orderId) {
    // Example: "Shov1005" → 1005 nikalna
    const match = lastOrder.orderId.match(/shov(\d+)/);

    if (match && match[1]) {
      lastNumber = parseInt(match[1]);
    }
  }

  const newNumber = lastNumber + 1;
  return `shov${newNumber}`;
}

    const orderID=await generateOrderId()
    // ✅ Handle COD Payment
    if (paymentMethod === "COD" || paymentMethod === "cod") {
const productName = Array.isArray(body.product) 
  ? body.product.map(p => p.title || p.product_title || "Product").join(", ")
  : "Product";

      const orderData = {
        orderId:orderID,
        customer: customer._id,
        email,
        phone:body.phone.toString(),
        customerName: body.fullName,
        customerAddress: body.address,
        products: Array.isArray(body.product) ? body.product.map(p => ({
          productId: p.id || p._id || Math.random().toString(36).substr(2, 9),
          title: p.title || p.product_title || "Product",
          price: p.price || p.product_price || 0,
          comparisonPrice: p.comparisonPrice || p.comparison_price || 0,
          quantity: p.quantity || 1,
          image: getImageUrl(p)
        })) : [],
        totalAmount: body.totalAmount || body.amount || 0,
        paymentMethod: "COD",
        paymentStatus: "pending",
        orderStatus: "processing",
        fbclid: body.fbclid || "",
    utm_source: body.utm_source || "",
    utm_medium: body.utm_medium || "",
    utm_campaign: body.utm_campaign || "",
      };

      if(orderID){
        await sendTelegramMessage(`
   🛒 <b>NEW COD ORDER RECEIVED</b>
   
   👤 Name: ${body.fullName}
   📞 Phone: ${body.phone}
   📦 Product: ${productName}
   💰 Amount: ₹${body.amount}
   🏠 Address: ${body.address}
   
   🔥 Check admin panel now!
     `);

      }

      const order = await Order.create(orderData);
      const shiprocket = await createShiprocketOrder(order, customer);
       await sendCapiForCOD(order, body);
      console.log("Shiprocket response:", shiprocket);
      if (shiprocket) {
        const shipment_id = shiprocket.shipment_id || shiprocket.data?.shipment_id || shiprocket.shipment?.shipment_id || "";
        const awb_code = shiprocket.awb_code || shiprocket.data?.awb_code || shiprocket.shipment?.awb || shiprocket.shipment?.awb_code || "";
        const shiprocket_order_id = shiprocket.order_id || shiprocket.data?.order_id || shiprocket.order_id || "";

        await Order.findByIdAndUpdate(order._id, {
          shipment_id,
          awb_code,
          shiprocket_order_id
        }, { new: true });
      }
      console.log(order)
      return NextResponse.json({
        success: true,
        message: "COD Order created successfully",
        order,
        customer,
        shiprocket
      });
    }
    // ✅ Handle Online Payment
    else {
      // ✅ Razorpay Instance
      if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
        throw new Error("Razorpay credentials not configured");
      }

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET
      });

      const amount = body.amount || body.totalAmount || 0;

      // ✅ Razorpay Order Create
      let razorpayOrder;
      try {
        razorpayOrder = await instance.orders.create({
          amount: Math.round(amount * 100), // ✅ Paise me
          currency: "INR",
          receipt: `receipt_${Date.now()}`
        });
      } catch (err) {
        console.error("Razorpay order error:", err);
        return NextResponse.json({
          success: false,
          message: err.error?.description || "Payment gateway error"
        }, { status: 500 });
      }

      // ✅ Update customer with order ID
      await Customer.findByIdAndUpdate(customer._id, {
        oid: razorpayOrder.id
      });

      const productName = Array.isArray(body.product) 
  ? body.product.map(p => p.title || p.product_title || "Product").join(", ")
  : "Product";

  const orderID=await generateOrderId()
      // ✅ Create Order Record
      const orderData = {
        orderId:orderID,
        customer: customer._id,
        email,
        phone:body.phone.toString(),
        fullName: body.fullName,
        customerName: body.fullName,
        customerAddress: body.address,
        products: Array.isArray(body.product) ? body.product.map(p => ({
          productId: p.id || p._id || Math.random().toString(36).substr(2, 9),
          title: p.title || p.product_title || "Product",
          price: p.price || p.product_price || 0,
          comparisonPrice: p.comparisonPrice || p.comparison_price || 0,
          quantity: p.quantity || 1,
          image: getImageUrl(p)
        })) : [],
        totalAmount: amount,
        razorpayOrderId: razorpayOrder.id,
        paymentMethod: "online",
        paymentStatus: "pending",
        orderStatus: "processing",
        fbclid: body.fbclid || "",
    utm_source: body.utm_source || "",
    utm_medium: body.utm_medium || "",
    utm_campaign: body.utm_campaign || "",
      };

     

      const order = await Order.create(orderData);
       
      if(order.paymentStatus=='paid'){
         await sendTelegramMessage(`
   🛒 <b>NEW Paid ORDER RECEIVED</b>
   
   👤 Name: ${body.fullName}
   📞 Phone: ${body.phone}
   📦 Product: ${productName}
   💰 Amount: ₹${body.amount}
   🏠 Address: ${body.address}
   
   🔥 Check admin panel now!
     `);
      }
      const shiprocket = await createShiprocketOrder(order, customer);
      console.log("Shiprocket response:", shiprocket);

      if (shiprocket) {
        const shipment_id = shiprocket.shipment_id || shiprocket.data?.shipment_id || shiprocket.shipment?.shipment_id || "";
        const awb_code = shiprocket.awb_code || shiprocket.data?.awb_code || shiprocket.shipment?.awb || shiprocket.shipment?.awb_code || "";
        const shiprocket_order_id = shiprocket.order_id || shiprocket.data?.order_id || shiprocket.order_id || "";

        await Order.findByIdAndUpdate(order._id, {
          shipment_id,
          awb_code,
          shiprocket_order_id
        }, { new: true });
      }
      console.log(order)

      return NextResponse.json({
        success: true,
        message: "Razorpay order created",
        order: razorpayOrder, // Razorpay order data
        dbOrder: order, // Database order
        customer,
        shiprocket
      });
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

// ✅ Helper function for image URL
function getImageUrl(product) {
  if (!product) return "";

  if (Array.isArray(product.image)) {
    return product.image[0]?.url || product.image[0]?.src || product.image[0] || "";
  }

  return product.image?.url || product.image?.src || product.image || "";
}


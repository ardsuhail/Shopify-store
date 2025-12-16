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
import nodemailer from 'nodemailer'





const generateInvoiceEmail = (orderData, customerData) => {
  const orderDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalItems = orderData.products.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate actual subtotal from products
  const subtotal = orderData.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${orderData.orderId}</title>
    <style>
        /* Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background-color: #f9fafb;
            padding: 16px;
            -webkit-text-size-adjust: 100%;
        }
        
        /* Main Container */
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
            padding: 32px 24px;
            text-align: center;
            position: relative;
        }
        
        .logo {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            padding: 12px;
        }
        
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        
        .header p {
            color: rgba(255, 255, 255, 0.9);
            margin-top: 8px;
            font-size: 16px;
        }
        
        /* Content */
        .content {
            padding: 24px;
        }
        
        /* Order Badge */
        .order-badge {
            background: #f0f9ff;
            border: 1px solid #e0f2fe;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        
        .order-info {
            display: flex;
            justify-content:space-between;
            align-items: center;
            flex-wrap: wrap;
            gap:20px;
        }
        
        .order-id {
            font-size: 18px;
            color: #0369a1;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .order-date {
            color: #64748b;
            font-size: 14px;
        }
        
        .status-badge {
            background: #22c55e;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
        }
        
        /* Customer Info - Mobile Responsive Grid */
        .customer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }
        
        .info-box {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        
        .info-title {
            margin: 0 0 12px;
            color: #475569;
            font-size: 16px;
            font-weight: 600;
        }
        
        /* Product Items */
        .product-item {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            background: #f8fafc;
            display: flex;
            align-items: center;
        }
        
        .product-image {
            width: 70px;
            height: 70px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 16px;
            flex-shrink: 0;
        }
        
        .product-details {
            flex: 1;
            min-width: 0; /* Important for text truncation */
        }
        
        .product-title {
            margin: 0 0 8px;
            color: #1f2937;
            font-weight: 600;
            font-size: 15px;
            word-break: break-word;
        }
        
        .product-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .product-quantity {
            color: #64748b;
            font-size: 14px;
        }
        
        .product-price {
            font-weight: 600;
            color: #16a34a;
            font-size: 16px;
        }
        
        .comparison-price {
            color: #dc2626;
            font-size: 12px;
            text-decoration: line-through;
            display: block;
        }
        
        /* Payment Summary */
        .payment-summary {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            padding: 24px;
            margin-top: 32px;
        }
        
        .summary-title {
            margin: 0 0 20px;
            color: #0c4a6e;
            font-size: 18px;
            font-weight: 700;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #cbd5e1;
        }
        
        .summary-row:last-child {
            border-bottom: none;
        }
        
        .total-row {
            border-top: 2px dashed #cbd5e1;
            margin-top: 20px;
            padding-top: 20px;
            font-size: 20px;
            font-weight: 800;
        }
        
        .total-amount {
            color: #16a34a;
            font-size: 24px;
        }
        
        /* Next Steps */
        .next-steps {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 20px;
            margin-top: 32px;
        }
        
        .steps-title {
            margin: 0 0 12px;
            color: #166534;
            font-size: 16px;
            font-weight: 600;
        }
        
        .steps-list {
            margin: 0;
            padding-left: 20px;
            color: #166534;
        }
        
        .steps-list li {
            margin-bottom: 8px;
        }
        
        /* CTA Button */
        .cta-button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin-top: 8px;
            width: 100%;
        }
        
        /* Footer */
        .footer {
            background: #0f172a;
            color: #94a3b8;
            padding: 24px;
            text-align: center;
        }
        
        .footer-logo {
            width: 40px;
            height: 40px;
            margin-bottom: 16px;
            opacity: 0.8;
        }
        
        .footer-links {
            margin-top: 16px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .footer-link {
            color: #60a5fa;
            text-decoration: none;
            font-size: 12px;
        }
        
        /* Media Queries for Mobile */
        @media (min-width: 480px) {
            .customer-grid {
            display:grid;
                grid-template-columns: 1fr ;
                gap:5px;
            }
             .footer-links {
            margin-top: 16px;
            display: grid;
             grid-template-columns: 1fr 1fr;
            justify-content: center;
            
            gap: 4px;
        }
            .payment-summary {
           
            padding: 14px;
        
        }
            .product-item {
                padding: 20px;
            }
                .order-info {
            display: flex;
            flex-direction:column;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        }
        
        @media (min-width: 640px) {
            body {
                padding: 24px;
            }
            
            .content {
                padding: 32px;
            }
            
            .cta-button {
                width: auto;
            }
        }
        
        /* Small Mobile Optimization */
        @media (max-width: 479px) {
        body{
        padding:15px;
        }
            .header {
                padding: 24px 16px;
            }
                 .footer-links {
            margin-top: 16px;
            display: grid;
             grid-template-columns: 1fr 1fr;
            justify-content: center;
            
            gap: 6px;
        }
                     .order-info {
            display: flex;
            flex-direction:column;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap:5px;
        }
        
        
.customer-grid {
            display:grid;
            grid-template-columns: 1fr;
            gap:5px;
            }
        .info-box {
            background: #f8fafc;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
            .header h1 {
                font-size: 20px;
            }
            
            .content {
                padding: 20px;
            }
            
            
           
            
            .product-image {
                width: 60px;
                height: 60px;
                margin-right: 12px;
            }
            
            .product-meta {
            display:grid;
              grid-template-columns: 1fr;
                
              
                gap: 4px;
            }
            
            .product-price {
                align-self: flex-start;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #111827;
            }
            
            .container {
                background: #1f2937;
                color: #f3f4f6;
            }
            
            .info-box, .product-item {
                background: #374151;
                border-color: #4b5563;
                color: #f3f4f6;
            }
            
            .order-badge {
                background: #1e3a8a;
                border-color: #3b82f6;
            }
            
            .product-title, .summary-title, .steps-title {
                color: #f3f4f6;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://cdn-icons-png.flaticon.com/512/891/891419.png" alt="Shopovix Logo" class="logo">
            <h1>Order Confirmed! 🎉</h1>
            <p>Thank you for your purchase</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Order Badge -->
            <div class="order-badge">
                <div class="order-info">
                    <div>
                        <div class="order-id">Order ID: #${orderData.orderId}</div>
                        <div class="order-date">${orderDate}</div>
                    </div>
                    <div class="status-badge">${orderData.orderStatus.charAt(0).toUpperCase() + orderData.orderStatus.slice(1)}</div>
                </div>
            </div>
            
            <!-- Customer Info -->
            <div class="customer-grid">
                <div class="info-box">
                    <h4 class="info-title">👤 Customer Details</h4>
                    <p style="margin: 8px 0; color: #1f2937; font-weight: 600;">Name: ${customerData.fullName}</p>
                    <p style="margin: 4px 0; color: #64748b;">📧 ${customerData.email}</p>
                    <p style="margin: 4px 0; color: #64748b;">📞 ${customerData.phone}</p>
                </div>
                
                <div class="info-box">
                    <h4 class="info-title">🏠 Shipping Address</h4>
                    <p style="margin: 8px 0; color: #64748b; font-size: 14px; line-height: 1.6;">${customerData.address}</p>
                </div>
            </div>
            
            <!-- Order Items -->
            <h3 style="color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; font-size: 18px;">
                Order Items (${totalItems})
            </h3>
            
            ${orderData.products.map(product => `
            <div class="product-item">
                <img src="${product.image || 'https://via.placeholder.com/80'}" 
                     alt="${product.title}" 
                     class="product-image"
                     onerror="this.src='https://via.placeholder.com/80'">
                <div class="product-details">
                    <h4 class="product-title">${product.title}</h4>
                    <div class="product-meta">
                        <div>
                            <span class="product-quantity">Qty: ${product.quantity}</span>
                        </div>
                        <div style="text-align: right;">
                            <span class="product-price">Price: ₹${product.price * product.quantity}</span>
                            ${product.comparisonPrice > product.price ?
      `<div class="comparison-price">₹${product.comparisonPrice * product.quantity}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            `).join('')}
            
            <!-- Payment Summary -->
            <div class="payment-summary">
                <h3 class="summary-title">Payment Summary</h3>
                
                <div class="summary-row">
                    <span>Subtotal: </span>
                    <span>₹${subtotal}</span>
                </div>
                
                <div class="summary-row">
                    <span>Shipping: </span>
                    <span style="color: #22c55e; font-weight: 600;">FREE</span>
                </div>
                
                <div class="summary-row">
                    <span>Payment Method: </span>
                    <span style="font-weight: 600;">${orderData.paymentMethod === 'COD' ? 'Cash on Delivery' : orderData.paymentMethod}</span>
                </div>
                
                <div class="summary-row total-row">
                    <span style="font-weight: 600; color: #0c4a6e;">Total Amount: </span>
                    <span class="total-amount">₹${orderData.totalAmount}</span>
                </div>
            </div>
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h4 class="steps-title">📦 What's Next?</h4>
                <ul class="steps-list">
                   <li>Your order has been successfully received</li>
                    <li>Your order is being processed by our team</li>
                    <li>You will receive shipping confirmation soon</li>
                    <li>Your tracking details will be shared via email</li>
                    <li>You can also check updates on the Shopovix tracking panel</li>
                    <li>Our support team is available for any help</li>
                    <li>Delivery timelines may vary based on your location</li>
                    <li> ${orderData.paymentMethod === 'COD' ?
                       " For COD: Keep exact amount ready"
                     :"Your payment has been successfully received"}
                    </li>
                    <li>Your package will be securely packed and dispatched</li>
                    <li>Thank you for choosing Shopovix!</li>
                </ul>
            </div>
            
            <!-- Help Section -->
            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin-bottom: 20px; font-size: 15px;">Need help with your order?</p>
                <a href="mailto:support@shopovix.com" class="cta-button">Contact Support</a>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <img src="https://cdn-icons-png.flaticon.com/512/891/891419.png" alt="Shopovix" class="footer-logo">
            <p style="margin: 8px 0; font-size: 14px;">Shopovix - Your Premium Shopping Destination</p>
            <p style="margin: 4px 0; font-size: 12px; color: #9ca3af;">Delivering happiness to your doorstep</p>
            <p style="margin: 8px 0; font-size: 12px;">© ${new Date().getFullYear()} Shopovix. All rights reserved.</p>
            
            <div class="footer-links">
                <a href="https://www.shopovix.store/privacy-policy" class="footer-link">Privacy Policy</a>
                <a href="https://www.shopovix.store/terms-&-conditions" class="footer-link">Terms of Service</a>
                <a href="https://www.shopovix.store/contact" class="footer-link">Contact Us</a>
                <a href="https://www.shopovix.store/track-your-order" class="footer-link">Track Order</a>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

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

    const orderID = await generateOrderId()
    // ✅ Handle COD Payment
    if (paymentMethod === "COD" || paymentMethod === "cod") {
      const productName = Array.isArray(body.product)
        ? body.product.map(p => p.title || p.product_title || "Product").join(", ")
        : "Product";

      const orderData = {
        orderId: orderID,
        customer: customer._id,
        email,
        phone: body.phone.toString(),
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

      if (orderID) {
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
      //nodmailer for invoice automation
      // Mail transporter setup (pehle se hai, bas yahan for reference)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Ab sendMail function call karo with professional template
      await transporter.sendMail({
        from: `"sssn" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✅ Order Confirmed! Your Invoice #${orderID} | ssn`,
        html: generateInvoiceEmail(orderData, {
          fullName: body.fullName,
          email: email,
          phone: body.phone,
          address: body.address
        })
      });
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

      const orderID = await generateOrderId()
      // ✅ Create Order Record
      const orderData = {
        orderId: orderID,
        customer: customer._id,
        email,
        phone: body.phone.toString(),
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
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Ab sendMail function call karo with professional template
      await transporter.sendMail({
        from: `"Shopovix" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✅ Order Confirmed! Your Invoice #${orderID} | Shopovix`,
        html: generateInvoiceEmail(orderData, {
          fullName: body.fullName,
          email: email,
          phone: body.phone,
          address: body.address
        })
      });
      if (order.paymentStatus == 'paid') {
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


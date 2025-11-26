// import axios from "axios";
// import Order from "@/model/Order";
// import connectDB from "@/db/connectDB";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { awb_code, orderId } = await req.json();
//     const token = process.env.SHIPROCKET_TOKEN;

//     if (!awb_code) {
//       return NextResponse.json({ success: false, message: "AWB code missing" });
//     }

//     const res = await axios.get(
//       `https://apiv2.shiprocket.in/v1/external/courier/track?awb=${awb_code}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const status =
//       res.data?.tracking_data?.shipment_track?.[0]?.current_status;

//     if (!status) {
//       return NextResponse.json({ success: false, message: "Tracking not found" });
//     }

//     await Order.findByIdAndUpdate(orderId, {
//       orderStatus: status.toLowerCase(),
//     });

//     return NextResponse.json({
//       success: true,
//       shiprocketStatus: status,
//     });
//   } catch (err) {
//     console.error("Tracking API Error:", err);
//     return NextResponse.json({ success: false, message: err.message });
//   }
// }

import axios from "axios";
import Order from "@/model/Order";
import connectDB from "@/db/connectDB";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const { awb_code, orderId } = await req.json();
    
    if (!awb_code && !orderId) {
      return NextResponse.json({ 
        success: false, 
        message: "Please provide Order ID or AWB Code" 
      });
    }
 let orderID=orderId.toLowerCase()
    // First try to find order in database using multiple fields
    let order = null;
    if (orderID) {
      // Check if the orderId is a valid MongoDB ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(orderId);
      
      const searchConditions = [
        { awb_code: orderID },
        { shiprocket_order_id: orderId },
        { razorpayOrderId: orderID },
        {orderId:orderID}
      ];
      
      // Only add _id condition if it's a valid ObjectId
      if (isValidObjectId) {
        searchConditions.unshift({ _id: orderId });
      }

      order = await Order.findOne({
        $or: searchConditions
      });

      console.log("Searching for order with:", {
        input: orderId,
        isValidObjectId,
        searchConditions,
        orderFound: !!order
      });
    }

    // If we have AWB code, get latest status from Shiprocket
    let shiprocketStatus = null;
    let shiprocketError = null;
    
    if (awb_code) {
      try {
        const token = process.env.SHIPROCKET_TOKEN;
        
        const res = await axios.get(
          `https://apiv2.shiprocket.in/v1/external/courier/track?awb=${awb_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        shiprocketStatus = res.data?.tracking_data?.shipment_track?.[0]?.current_status;
        
        if (!shiprocketStatus) {
          shiprocketError = "No tracking data found from courier";
        }
      } catch (shiprocketErr) {
        console.error("Shiprocket API Error:", shiprocketErr);
        shiprocketError = "Courier tracking temporarily unavailable";
      }
    }

    // Update order status if we found new status from Shiprocket
    if (order && shiprocketStatus) {
      try {
        await Order.findByIdAndUpdate(order._id, {
          orderStatus: shiprocketStatus.toLowerCase(),
        });
        console.log("Order status updated to:", shiprocketStatus);
      } catch (updateErr) {
        console.error("Error updating order status:", updateErr);
      }
    }

    // Return the most relevant status
    let finalStatus = shiprocketStatus || order?.orderStatus;

    if (!finalStatus && !order) {
      return NextResponse.json({ 
        success: false, 
        message: "No order found with this tracking ID" 
      });
    }

    if (!finalStatus && order) {
      finalStatus = order.orderStatus || "processing";
    }

    const responseData = {
      success: true,
      shiprocketStatus: finalStatus,
      orderDetails: order ? {
        orderId: orderId,
        awbCode: order.awb_code,
        razorpayOrderId: order.razorpayOrderId,
        shiprocketOrderId: order.shiprocket_order_id,
        totalAmount: order.totalAmount,
        customerName: order.customerName,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      } : null
    };

    // Add shiprocket error info if any
    if (shiprocketError) {
      responseData.shiprocketError = shiprocketError;
    }

    return NextResponse.json(responseData);
    
  } catch (err) {
    console.error("Tracking API Error:", err);
    
    // User-friendly error messages
    let errorMessage = "Unable to track order at the moment";
    
    if (err.name === 'CastError') {
      errorMessage = "Invalid order format";
    } else if (err.response?.status === 404) {
      errorMessage = "Tracking number not found in system";
    } else if (err.code === 'ECONNABORTED') {
      errorMessage = "Request timeout. Please try again";
    } else if (err.message?.includes('connect')) {
      errorMessage = "Network error. Please check your connection";
    }
    
    return NextResponse.json({ 
      success: false, 
      message: errorMessage 
    });
  }
}
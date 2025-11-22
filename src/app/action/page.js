// "use server";

// export async function initiatePayment(amount, formData, products, customerName, customerAddress) {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/customer`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         // ✅ Consistent field names
//         fullName: formData.fullName || customerName,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address || customerAddress,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         country: formData.country || "India",
        
//         // ✅ Correct product structure
//         product: products.map(p => ({
//           id: p.id || p.productId,
//           title: p.title || p.product_title,
//           price: p.price || p.product_price,
//           quantity: p.quantity || 1,
//           image: p.image || ""
//         })),
        
//         totalAmount: amount,
//         paymentMethod: "online", // ✅ lowercase
//         customerName: formData.fullName || customerName,
//         customerAddress: formData.address || customerAddress
//       }),
//     });

//     const data = await res.json();
    
//     if (data.success) {
//       return {
//         success: true,
//         order: data.order, // Razorpay order
//         dbOrder: data.dbOrder // Database order
//       };
//     } else {
//       throw new Error(data.message || "Failed to initiate payment");
//     }
//   } catch (err) {
//     console.error("Error in initiatePayment:", err);
//     return {
//       success: false,
//       error: err.message
//     };
//   }
// }
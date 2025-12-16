
import axios from "axios";

export async function getShiprocketToken() {
  try {
    const res = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SR_EMAIL,
        password: process.env.SR_PASSWORD,
      }
    );

    return res.data.token;
  } catch (err) {
    // console.log("Shiprocket Token Error:", err.response?.data);
    return null;
  }
}

// 🚀 New Function: Create Order in Shiprocket
export async function createShiprocketOrder(order, customer) {
  const token = await getShiprocketToken();
  if (!token) return null;

  const items = order.products.map(p => ({
    name: p.title,
    sku: p.productId,
    units: p.quantity,
    selling_price: p.price,
    discount: 0,
    tax: 0
  }));

  const payload = {
    order_id: order._id.toString(),
    order_date: new Date().toISOString(),
    pickup_location: "Home", // Shiprocket pickup name
    billing_customer_name: customer.fullName,
    billing_last_name: "",
    billing_address: customer.address,
    billing_city: customer.city,
    billing_pincode: customer.pincode,
    billing_state: customer.state,
    billing_country: "India",
    billing_email: customer.email,
    billing_phone: customer.phone,
    shipping_is_billing: true,
    order_items: items,
    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: order.totalAmount,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5
  };

  try {
    const res = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return res.data;
  } catch (err) {
    // console.log("Shiprocket Order Error:", err.response?.data);
    return null;
  }
}
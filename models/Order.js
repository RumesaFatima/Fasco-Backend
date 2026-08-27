import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  stripeSessionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  user: { type: String, required: true },
  lines: [{
    productId: String,
    name: String,
    image: String,
    color: String,
    size: String,
    qty: Number,
    price: Number
  }],
  subtotal: Number, discount: Number, shipping: Number, total: Number,
  address:
    { firstName: String, lastName: String, country: String, address: String, city: String, postal: String },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid", "Failed", "Refunded"],
    default: "Unpaid",
  },
  deliveryStatus: {
    type: String,
    enum: [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },
  status: {
    type: String,
    default: "Processing",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);

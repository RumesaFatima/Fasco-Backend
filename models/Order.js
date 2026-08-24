import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, user: { type: String, required: true },
  lines: [{ productId: String, name: String, image: String, color: String, size: String, qty: Number, price: Number }],
  subtotal: Number, discount: Number, shipping: Number, total: Number,
  address: { firstName: String, lastName: String, country: String, address: String, city: String, postal: String },
  status: { type: String, default: "Processing" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);

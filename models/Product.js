import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, name: { type: String, required: true },
  category: { type: String, index: true }, brand: { type: String, default: "FASCO" },
  price: { type: Number, required: true }, oldPrice: Number, rating: { type: Number, default: 4 },
  reviews: { type: Number, default: 0 }, colors: [{ name: String, hex: String }], sizes: [String],
  stock: { type: Number, default: 10 }, image: String, gallery: [String], description: String, tags: [String]
}, { timestamps: true });

export default mongoose.model("Product", productSchema);

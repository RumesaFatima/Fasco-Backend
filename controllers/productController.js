import Product from "../models/Product.js";

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");

export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const q = {};
    if (search) q.name = new RegExp(escapeRegex(search), "i");
    if (category && category !== "All") q.category = category;
    const products = await Product.find(q).lean();
    if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
    if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" }); res.json(p);
  }
  catch (e) { res.status(400).json({ message: "Invalid product id" }); }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(await Product.find({
      _id: { $ne: p._id }, category: p.category
    }).limit(4));
  } catch (e) { res.status(400).json({ message: "Invalid product id" }); }
};

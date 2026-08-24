import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { lines, subtotal, discount, shipping, total, address } = req.body;
    const order = await Order.create({ id: "FS-" + String(Math.floor(100000 + Math.random()*900000)), user: req.user.email, lines, subtotal, discount, shipping, total, address });
    res.status(201).json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const getOrders = async (req, res) => {
  try { res.json(await Order.find({ user: req.user.email }).sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

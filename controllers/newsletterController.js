import Newsletter from "../models/Newsletter.js";

export const subscribe = async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    if (!email) return res.status(400).json({ message: "Email is required" });
    await Newsletter.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

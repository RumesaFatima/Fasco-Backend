import express from "express";
import { createCheckoutSession,
    getCheckoutSession
 } from "../controllers/paymentController.js";

const router = express.Router();
router.get("/checkout-session/:sessionId", getCheckoutSession);
router.post("/create-checkout-session", createCheckoutSession);

export default router;
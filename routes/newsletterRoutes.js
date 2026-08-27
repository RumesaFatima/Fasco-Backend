import express from "express";
import {
    subscribeNewsletter,
    getNewsletterSubscribers,
} from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/subscribers", getNewsletterSubscribers);

export default router;
import express from "express";

import {
    createReview,
    getProductReviews,
    getAllReviews,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", authMiddleware, createReview);

router.get("/product/:productId", getProductReviews);

router.get("/admin/all", authMiddleware, getAllReviews);


export default router;
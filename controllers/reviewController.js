import Review from "../models/Review.js";

export const createReview = async (req, res) => {
    try {
        const { productId, productName, rating, comment } = req.body;

        if (!productId || !productName || !rating || !comment?.trim()) {
            return res.status(400).json({
                success: false,
                message: "All review fields are required.",
            });
        }

        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required.",
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5.",
            });
        }

        const review = await Review.create({
            productId: String(productId),
            productName: String(productName).trim(),
            userId: String(userId),
            customerName:
                req.user?.name ||
                req.user?.username ||
                "Customer",
            customerEmail: req.user?.email || "",
            rating: numericRating,
            comment: comment.trim(),
            status: "Approved",
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            review,
        });
    } catch (error) {
        console.error("Create review error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to submit review.",
        });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required.",
            });
        }

        const reviews = await Review.find({
            productId: String(productId),
            status: "Approved",
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error("Get product reviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load reviews.",
        });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error("Get all reviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load reviews.",
        });
    }
};
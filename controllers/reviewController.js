import Review from "../models/Review.js";

export const createReview = async (req, res) => {
    try {
        const {
            productId,
            productName,
            rating,
            comment,
        } = req.body;

        if (!productId || !productName || !rating || !comment) {
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

        const review = await Review.create({
            productId,
            productName,
            userId: String(userId),

            customerName:
                req.user?.name ||
                req.user?.username ||
                "Customer",

            customerEmail:
                req.user?.email ||
                "",

            rating: Number(rating),
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
            message: "Failed to submit review.",
        });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({
            productId,
            status: "Approved",
        }).sort({
            createdAt: -1,
        });

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
        const reviews = await Review.find()
            .sort({
                createdAt: -1,
            });

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
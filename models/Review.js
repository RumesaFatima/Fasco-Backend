import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
        },

        productName: {
            type: String,
            required: true,
        },

        userId: {
            type: String,
            required: true,
        },

        customerName: {
            type: String,
            required: true,
        },

        customerEmail: {
            type: String,
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["Approved", "Pending", "Rejected"],
            default: "Approved",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Review", reviewSchema);
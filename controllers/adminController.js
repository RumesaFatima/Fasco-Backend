import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const admin = await User.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const role = String(admin.role || "").toLowerCase();

        if (role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: "admin",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name || admin.username || "Admin",
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Admin login failed",
        });
    }
};

export const getAdminProfile = async (req, res) => {
    try {
        const admin = req.admin || req.user;

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin authentication required",
            });
        }

        return res.status(200).json({
            success: true,
            admin: {
                id: admin._id,
                name: admin.name || admin.username || "Admin",
                email: admin.email,
                role: admin.role || "admin",
            },
        });
    } catch (error) {
        console.error("Admin profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin profile",
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            pendingOrders,
            lowStockProducts,
            outOfStockProducts,
            totalReviews,
            orders,
            customers,
            reviews,
            products,
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.countDocuments({
                status: {
                    $in: [
                        "Pending",
                        "pending",
                        "Processing",
                        "processing",
                    ],
                },
            }),
            Product.countDocuments({
                stock: {
                    $gt: 0,
                    $lte: 10,
                },
            }),
            Product.countDocuments({
                stock: {
                    $lte: 0,
                },
            }),
            Review.countDocuments(),
            Order.find()
                .sort({ createdAt: -1 })
                .limit(20)
                .lean(),
            User.find()
                .sort({ createdAt: -1 })
                .limit(20)
                .select("-password")
                .lean(),
            Review.find()
                .sort({ createdAt: -1 })
                .limit(20)
                .lean(),
            Product.find()
                .sort({ createdAt: -1 })
                .limit(50)
                .lean(),
        ]);

        const allOrders = await Order.find().lean();

        const totalSales = allOrders.reduce((total, order) => {
            const amount = Number(
                order.total ??
                order.totalAmount ??
                order.amount ??
                order.grandTotal ??
                0
            );

            const paymentStatus = String(
                order.paymentStatus ||
                order.payment?.status ||
                ""
            ).toLowerCase();

            if (
                paymentStatus &&
                ![
                    "paid",
                    "succeeded",
                    "success",
                ].includes(paymentStatus)
            ) {
                return total;
            }

            return total + (
                Number.isFinite(amount)
                    ? amount
                    : 0
            );
        }, 0);

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalSales,
                pendingOrders,
                lowStockProducts,
                outOfStockProducts,
                totalReviews,
            },
            orders,
            customers,
            reviews,
            products,
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
        });
    }
};
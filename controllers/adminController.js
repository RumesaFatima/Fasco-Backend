import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return res.status(500).json({
                success: false,
                message: "Admin credentials are not configured",
            });
        }

        if (
            email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
            password !== adminPassword
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials",
            });
        }

        const token = jwt.sign(
            {
                email: adminEmail,
                role: "admin",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                email: adminEmail,
                role: "admin",
            },
        });
    } catch (error) {
        console.error("Admin Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const getAdminProfile = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            admin: {
                email: req.admin.email,
                role: req.admin.role,
            },
        });
    } catch (error) {
        console.error("Admin Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .lean();

        const paidOrders = orders.filter((order) => {
            return (
                order.paymentStatus === "Paid" ||
                order.paymentStatus === "paid"
            );
        });

        const totalSales = paidOrders.reduce(
            (sum, order) => {
                return sum + (Number(order.total) || 0);
            },
            0
        );

        const pendingOrders = orders.filter((order) => {
            const status =
                order.deliveryStatus ||
                order.status ||
                "Pending";

            return (
                status === "Pending" ||
                status === "Processing"
            );
        }).length;

        const lowStockProducts = await Product.countDocuments({
            stock: {
                $gt: 0,
                $lte: 10,
            },
        });

        const outOfStockProducts = await Product.countDocuments({
            stock: {
                $lte: 0,
            },
        });

        const totalReviews = await Review.countDocuments();

        const recentOrders = orders.slice(0, 10).map((order) => {
            const customerName =
                order.address?.firstName ||
                order.user ||
                "Customer";

            const customerLastName =
                order.address?.lastName || "";

            const firstProduct =
                order.lines?.[0] || {};

            return {
                id: order.id,

                customer: `${customerName} ${customerLastName}`.trim(),

                email: order.user,

                product: firstProduct.name || "FASCO Product",

                productImage: firstProduct.image || "",

                date: order.createdAt,

                amount: Number(order.total || 0),

                paymentStatus:
                    order.paymentStatus ||
                    "Unpaid",

                deliveryStatus:
                    order.deliveryStatus ||
                    order.status ||
                    "Pending",

                status:
                    order.deliveryStatus ||
                    order.status ||
                    "Pending",
            };
        });

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();



        const customers = await User.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .select("name email createdAt")
            .lean();

      
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

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

            orders: recentOrders,

            products,

            customers,

            reviews,
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not load dashboard data",
        });
    }
};
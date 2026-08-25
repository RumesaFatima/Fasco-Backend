import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
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

        const orders = await Order.find();

        const totalSales = orders.reduce(
            (sum, order) => sum + (Number(order.total) || 0),
            0
        );

        const pendingOrders = await Order.countDocuments({
            status: "Processing"
        });

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalSales,
                pendingOrders
            }
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not load dashboard data"
        });
    }
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
            adminEmail &&
            adminPassword &&
            email.trim().toLowerCase() ===
                adminEmail.trim().toLowerCase() &&
            password === adminPassword
        ) {
            const token = jwt.sign(
                {
                    email: adminEmail,
                    role: "admin"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            return res.json({
                message: "Admin login successful",
                token,
                user: {
                    email: adminEmail,
                    role: "admin",
                    isAdmin: true
                }
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message: "This account uses Google login"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: "user",
                isAdmin: false
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};
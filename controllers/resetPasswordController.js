import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        if (password.length !== 8) {
            return res.status(400).json({
                message: "Password must be exactly 8 characters"
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Password reset failed",
            error: error.message
        });
    }
};
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpires =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl =
            `http://localhost:5173/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Reset Your Password",
            `
                <div style="font-family: Arial, sans-serif;">
                    <h2>FASCO Password Reset</h2>

                    <p>
                        We received a request to reset your password.
                    </p>

                    <p>
                        Click the button below to create a new password.
                    </p>

                    <a
                        href="${resetUrl}"
                        style="
                            display:inline-block;
                            padding:12px 20px;
                            background:#111;
                            color:#fff;
                            text-decoration:none;
                            border-radius:5px;
                        "
                    >
                        Reset Password
                    </a>

                    <p style="margin-top:20px;">
                        This link expires in 15 minutes.
                    </p>
                </div>
            `
        );

        return res.status(200).json({
            message: "Password reset email sent",
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);

        return res.status(500).json({
            message: "Could not send reset email",
        });
    }
};
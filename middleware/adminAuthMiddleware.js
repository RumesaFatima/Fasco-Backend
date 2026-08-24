import jwt from "jsonwebtoken";

export const adminAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Admin authorization required",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin token",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access only",
            });
        }

        req.admin = decoded;

        next();
    } catch (error) {
        console.error("Admin Auth Error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin token",
        });
    }
};
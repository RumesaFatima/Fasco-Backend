import express from "express";

import {
    adminLogin,
    getAdminProfile,
} from "../controllers/adminController.js";

import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();


router.post("/login", adminLogin);


router.get(
    "/profile",
    adminAuthMiddleware,
    getAdminProfile
);


export default router;
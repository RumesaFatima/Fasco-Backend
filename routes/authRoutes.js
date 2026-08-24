import express from "express";

import { signup } from "../controllers/signupController.js";
import { login } from "../controllers/loginController.js";
import {
    forgotPassword
} from "../controllers/forgotPasswordController.js";
import {
    resetPassword
} from "../controllers/resetPasswordController.js";
import {
    googleLogin
} from "../controllers/googleController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/google", googleLogin);

export default router;

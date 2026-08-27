import express from "express";

import {
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post(
    "/",
    adminAuthMiddleware,
    createProduct
);

router.put(
    "/:id",
    adminAuthMiddleware,
    updateProduct
);

router.delete(
    "/:id",
    adminAuthMiddleware,
    deleteProduct
);

export default router;
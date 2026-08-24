import { Router } from "express";
import { getProducts, getProductById, getRelatedProducts } from "../controllers/productController.js";
const router = Router();
router.get("/related/:id", getRelatedProducts);
router.get("/:id", getProductById);
router.get("/", getProducts);
export default router;

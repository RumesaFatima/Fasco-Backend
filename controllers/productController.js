import Product from "../models/Product.js";

const escapeRegex = (s) =>
  String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const q = {};

    if (search) {
      q.name = new RegExp(escapeRegex(search), "i");
    }

    if (category && category !== "All") {
      q.category = category;
    }

    const products = await Product.find(q).lean();

    if (sort === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    let product = null;

    try {
      product = await Product.findById(req.params.id);
    } catch { }

    if (!product) {
      product = await Product.findOne({
        id: req.params.id,
      });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    let product = null;

    try {
      product = await Product.findById(req.params.id);
    } catch { }

    if (!product) {
      product = await Product.findOne({
        id: req.params.id,
      });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(4);

    return res.status(200).json(relatedProducts);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = null;

    try {
      product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    } catch { }

    if (!product) {
      product = await Product.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    let product = null;

    try {
      product = await Product.findByIdAndDelete(
        req.params.id
      );
    } catch { }

    if (!product) {
      product = await Product.findOneAndDelete({
        id: req.params.id,
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /api/products/add → Add a new product
router.post("/add", upload.single("photo"), async (req, res) => {
  try {
    const { productName, rate, kg } = req.body;

    const product = new Product({
      name: productName,
      price: rate,
      inStock: kg,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (err) {
    console.error("❌ Error saving product:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/products → Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// server/routes/productRoutes.js
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

    res.status(204).send(); // <-- This returns 204
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/products/update/:id → Update a product
router.put("/update/:id", upload.single("photo"), async (req, res) => {
  try {
    const { productName, rate, kg } = req.body;

    const updatedData = {
      name: productName,
      price: rate,
      inStock: kg
    };

    // If a new image is uploaded, update the imageUrl
    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true } // return the updated document
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "✅ Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

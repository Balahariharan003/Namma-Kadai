import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// ================= Multer Setup =================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure uploads/ folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= Routes =================

// ✅ GET all products
router.get("/overview", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE product (with optional image upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, inStock } = req.body;

    const updateData = { name, price, inStock };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
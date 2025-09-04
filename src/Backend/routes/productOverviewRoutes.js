import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products/overview → fetch all products
router.get("/overview", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

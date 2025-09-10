// routes/orderRoutes.js
import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * Create new order (checkout) - SINGLE FARMER
 */
router.post("/", async (req, res) => {
  try {
    const { customerId, farmerId, products, address, paymentMethod, total } = req.body;

    console.log("📥 Incoming Order Request:", req.body);

    // Validate required fields
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products in order" });
    }

    // Ensure farmerId exists (either from root or first product)
    const resolvedFarmerId = farmerId || products[0]?.farmerId;
    if (!resolvedFarmerId) {
      return res.status(400).json({ error: "farmerId is required" });
    }

    const order = new Order({
      customerId,
      farmerId: resolvedFarmerId,
      products,
      address,
      paymentMethod,
      total,
    });

    const savedOrder = await order.save();
    console.log("✅ Saved Order:", savedOrder);

    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get orders by farmer
 */
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ error: "Invalid farmerId" });
    }

    console.log("🔎 Fetching orders for farmer:", farmerId);

    const orders = await Order.find({ farmerId })
      .populate("customerId", "name email")
      .populate("products.productId", "name price");

    console.log(`📦 Found ${orders.length} orders for farmer ${farmerId}`);

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching farmer orders:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get orders by customer
 */
router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: "Invalid customerId" });
    }

    console.log("🔎 Fetching orders for customer:", customerId);

    const orders = await Order.find({ customerId })
      .populate("farmerId", "name email")
      .sort({ createdAt: -1 });

    console.log(`📦 Found ${orders.length} orders for customer ${customerId}`);

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching customer orders:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

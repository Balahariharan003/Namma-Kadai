// routes/orderRoutes.js
import express from "express";
import mongoose from "mongoose";   // ✅ Add this
import Order from "../models/Order.js";

const router = express.Router();

// Create new order (checkout)
// Create new order (checkout)
router.post("/", async (req, res) => {
  try {
    const { customerId, products, address, paymentMethod, total } = req.body;

    // Group products by farmerId
    const productsByFarmer = {};
    products.forEach((p) => {
      if (!productsByFarmer[p.farmerId]) {
        productsByFarmer[p.farmerId] = [];
      }
      productsByFarmer[p.farmerId].push(p);
    });

    // Collect created orders
    const createdOrders = [];

    for (const farmerId in productsByFarmer) {
      const order = new Order({
        customerId,
        farmerId,
        products: productsByFarmer[farmerId],
        address,
        paymentMethod,
        total: productsByFarmer[farmerId].reduce(
          (sum, p) => sum + p.price * p.quantity,
          0
        )
      });
      const savedOrder = await order.save();
      createdOrders.push(savedOrder);
    }

    res.status(201).json({ message: "Orders placed successfully", orders: createdOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get orders by farmer
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;

    // ✅ Validate ObjectId properly
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ error: "Invalid farmerId" });
    }

    const orders = await Order.find({ farmerId: req.params.farmerId })
      .populate("customerId")
      .populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by customer
router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: "Invalid customerId" });
    }

    const orders = await Order.find({ customerId })
      .populate("farmerId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

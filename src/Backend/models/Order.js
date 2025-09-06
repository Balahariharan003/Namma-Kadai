// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true }, // 👈 main farmer for this order
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" }, // 👈 add farmer per product
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  address: String,
  paymentMethod: String,
  total: Number,
  status: { type: String, enum: ["pending", "confirmed", "delivered"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);

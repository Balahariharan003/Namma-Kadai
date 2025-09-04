import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import farmerAuthRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import productOverviewRoutes from "./routes/productOverviewRoutes.js"; // ✅ new import
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // parse JSON bodies

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// Routes
app.use("/", farmerAuthRoutes);
app.use("/api/products", productRoutes);           // add/update/delete
app.use("/api/products", productOverviewRoutes);   // overview only (GET /overview)

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(8000, () => console.log("Server running on http://localhost:8000"));
  })
  .catch((err) => console.error("MongoDB error:", err));

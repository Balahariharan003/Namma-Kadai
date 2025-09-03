import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import farmerAuthRoutes from "./routes/auth.js";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // parse JSON bodies

// routes
app.use("/", farmerAuthRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(8000, () => console.log("Server running on http://localhost:8000"));
  })
  .catch((err) => console.error("MongoDB error:", err));

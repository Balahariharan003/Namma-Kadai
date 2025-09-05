import express from "express";
import Farmer from "../models/Farmer.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

const router = express.Router();

// ===== Multer Config =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ===== Signup =====
router.post("/signup", upload.single("profilePhoto"), async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      password,
      latitude,
      longitude
    } = req.body;

    // Validate lat/lon presence
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    // Convert to numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ message: "Invalid latitude or longitude" });
    }

    // Check if farmer already exists
    const existing = await Farmer.findOne({
      $or: [{ mobile }, { email }]
    });

    if (existing) {
      return res.status(400).json({
        message:
          existing.mobile === mobile
            ? "Mobile already registered"
            : "Email already registered",
      });
    }

    // Create farmer
    const farmer = new Farmer({
      name,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      password,
      latitude: lat,
      longitude: lon,
      profilePhoto: req.file?.path || null,
    });

    await farmer.save();

    res.status(201).json({
      message: "Farmer registered successfully",
      farmer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// ===== Login =====
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ farmer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;

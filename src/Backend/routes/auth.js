import express from "express";
import Farmer from "../models/Farmer.js"; // 👈 your Farmer model
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

const router = express.Router();

// ===== Multer Config =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * Signup Route (already in your code, just keep for reference)
 */
router.post("/signup", upload.single("profilePhoto"), async (req, res) => {
  try {
    const { name, mobile, email, address, city, state, pincode, password } = req.body;

    // 🔍 check for duplicates
    const existing = await Farmer.findOne({
      $or: [{ mobile }, { email }]
    });

    if (existing) {
      return res.status(400).json({
        message: existing.mobile === mobile
          ? "Mobile already registered"
          : "Email already registered"
      });
    }

    const farmer = new Farmer({
      name,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      password, // (you should hash this later)
      profilePhoto: req.file?.path
    });

    await farmer.save();
    res.status(201).json({ message: "Farmer registered successfully", farmer });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



/**
 * ✅ Login Route
 */
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // 1. Check if farmer exists
    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) {
      return res.status(400).json({ message: "Invalid mobile or password" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid mobile or password" });
    }

    // 3. Success
    res.status(200).json({
      message: "Login successful",
      farmer: {
        id: farmer._id,
        name: farmer.name,
        mobile: farmer.mobile,
        email: farmer.email,
        address: farmer.address,
        city: farmer.city,
        state: farmer.state,
        pincode: farmer.pincode,
        profilePhoto: farmer.profilePhoto,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;

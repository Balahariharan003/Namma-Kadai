import express from "express";
import Customer from "../models/Customer.js";
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
    const { name, mobile, email, address, city, state, pincode, password } = req.body;

    const existing = await Customer.findOne({ $or: [{ mobile }, { email }] });
    if (existing) {
      return res.status(400).json({
        message: existing.mobile === mobile ? "Mobile already registered" : "Email already registered",
      });
    }

    const customer = new Customer({
      name,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      password,
      profilePhoto: req.file?.path,
    });

    await customer.save();
    res.status(201).json({ message: "Customer registered successfully", customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== Login =====
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const customer = await Customer.findOne({ mobile });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;

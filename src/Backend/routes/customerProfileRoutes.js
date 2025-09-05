import express from "express";
import Customer from "../models/Customer.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ===== Multer Config for Profile Photo =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ===== GET Customer Profile by Mobile =====
router.get("/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;
    const customer = await Customer.findOne({ mobile });

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const customerJson = customer.toObject();
    customerJson.profilePhoto = customer.profilePhoto
      ? `http://localhost:8000/${customer.profilePhoto}`
      : null;

    res.json(customerJson);
  } catch (err) {
    console.error("Error fetching customer profile:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// ===== UPDATE Customer Profile =====
router.put("/:mobile", upload.single("profilePhoto"), async (req, res) => {
  try {
    const { mobile } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.profilePhoto = req.file.path;
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { mobile },
      updateData,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerJson = updatedCustomer.toObject();
    customerJson.profilePhoto = updatedCustomer.profilePhoto
      ? `http://localhost:8000/${updatedCustomer.profilePhoto}`
      : null;

    res.json(customerJson);
  } catch (err) {
    console.error("Error updating customer profile:", err);
    res.status(500).json({ message: "Error updating customer profile" });
  }
});

export default router;

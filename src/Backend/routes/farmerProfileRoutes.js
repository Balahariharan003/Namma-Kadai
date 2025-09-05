import express from "express";
import Farmer from "../models/Farmer.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ===== Multer Config for Updates =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ===== GET Farmer Profile by Mobile =====
router.get("/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;
    const farmer = await Farmer.findOne({ mobile });

    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const farmerJson = farmer.toObject();
    farmerJson.profilePhoto = farmer.profilePhoto
      ? `http://localhost:8000/${farmer.profilePhoto}`
      : null;

    res.json(farmerJson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// ===== UPDATE Farmer Profile =====
router.put("/:mobile", upload.single("profilePhoto"), async (req, res) => {
  try {
    const { mobile } = req.params;

    const updateData = { ...req.body };
    if (req.file) {
      updateData.profilePhoto = req.file.path;
    }

    const updatedFarmer = await Farmer.findOneAndUpdate(
      { mobile },
      updateData,
      { new: true }
    );

    if (!updatedFarmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const farmerJson = updatedFarmer.toObject();
    farmerJson.profilePhoto = updatedFarmer.profilePhoto
      ? `http://localhost:8000/${updatedFarmer.profilePhoto}`
      : null;

    res.json(farmerJson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating farmer profile" });
  }
});

export default router;

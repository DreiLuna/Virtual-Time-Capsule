import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const router = Router();

import { Image } from "../database.js";

// POST /api/images/upload
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const image = await Image.create({
      filename: req.file.filename,
      title: req.body.title || null,
      userId: req.user.id,
    });
    res.status(201).json({
      message: "Image uploaded successfully!",
      image: {
        id: image.id,
        filename: image.filename,
        title: image.title,
        url: `/uploads/${image.filename}`,
        createdAt: image.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save image metadata" });
  }
});

// GET /api/images - list images for the logged-in user
router.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  try {
    const images = await Image.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({
      images: images.map(img => ({
        id: img.id,
        filename: img.filename,
        title: img.title,
        url: `/uploads/${img.filename}`,
        createdAt: img.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to list images" });
  }
});

export default router;

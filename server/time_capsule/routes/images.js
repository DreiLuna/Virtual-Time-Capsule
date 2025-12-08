import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import archiver from "archiver";

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

// GET /api/images/download-all - download all user's images as a zip
router.get("/download-all", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const images = await Image.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (images.length === 0) {
      return res.status(404).json({ message: "No images to download" });
    }

    const archiver = (await import("archiver")).default;
    
    const archive = archiver("zip", {
      zlib: { level: 9 }, // compression level
    });

    // Set response headers
    res.attachment(`time-capsule-${Date.now()}.zip`);
    res.setHeader("Content-Type", "application/zip");

    // Pipe archive to response
    archive.pipe(res);

    // Add each image to the zip
    for (const img of images) {
      const filePath = path.join(uploadDir, img.filename);
      if (fs.existsSync(filePath)) {
        // Use title as filename if available, otherwise use original filename
        const zipFilename = img.title 
          ? `${img.title.replace(/[^a-z0-9]/gi, '_')}_${img.id}${path.extname(img.filename)}`
          : img.filename;
        archive.file(filePath, { name: zipFilename });
      }
    }

    // Finalize the archive
    await archive.finalize();
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Failed to create zip file" });
  }
});

export default router;

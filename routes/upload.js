import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Product from '../models/Product.js';
 
const router = express.Router();

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

// 🔍 Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});


const fileFilter = (req, file, cb) => {
  console.log('🧪 Filtering file:', file.originalname, file.mimetype);

  if (!file.mimetype.startsWith('image/')) {
    console.log('❌ Rejected: Not an image');
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'), false);
  }

  cb(null, true);
};

// 📦 Multer instance
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

// ✅ Upload route
router.post('/', (req, res, next) => {
  upload.single('file')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error('🚫 Multer error:', err.message);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('🔥 Unknown error:', err);
      return res.status(500).json({ error: err.message });
    }

    const { name } = req.body;
    const file = req.file;

    if (!file) {
      console.log('⚠️ No file attached!');
      return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }

    console.log('✅ Upload received:', file.originalname, file.size);

    try {
      const product = new Product({
        name: name,
        licence: file.mimetype
      });

      await product.save();

      res.status(200).json({
        message: 'Upload successful',
        product
      });
    } catch (dbErr) {
      console.error('❌ DB Save error:', dbErr);
      res.status(500).json({ error: 'Failed to save product' });
    }
  });
});

export default router;

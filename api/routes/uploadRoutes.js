import express from 'express';
import fileUpload from 'express-fileupload';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router();

// Use file upload middleware
router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

router.post('/', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.image;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'mern-blog/profile-pics',
      use_filename: true,
      unique_filename: false, // keeps original name
    });

    fs.unlinkSync(file.tempFilePath); // Cleanup temp file

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary Upload Failed',
      error: error.message,
    });
  }
});

export default router;

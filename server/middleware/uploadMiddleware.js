// ============================================================
// middleware/uploadMiddleware.js - File Upload (Multer)
// ============================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage settings for uploaded files
const storage = multer.diskStorage({
  // Where to save the file
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // What to name the file (timestamp + original name to avoid duplicates)
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `event-${uniqueSuffix}${extension}`);
  },
});

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, .webp images are allowed'), false);
  }
};

// Create the multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB file size
  },
});

module.exports = upload;

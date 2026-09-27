import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { uploadDocument, getDocuments, downloadDocument } from '../controllers/compliance.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/compliance';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer file filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, CSV, Word, and Images are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

router.use(protect);

router.post('/upload', upload.single('document'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id/download', downloadDocument);

export default router;

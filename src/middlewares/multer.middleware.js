import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { config } from '../config/appConfig.js';

// Use config.uploadsDir from appConfig
const baseUploadDir = path.resolve(process.cwd(), config.uploadsDir);
const documentUploadDir = path.join(baseUploadDir, 'documents');

// Create directories
[baseUploadDir, documentUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, documentUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

export const upload = multer({ storage });

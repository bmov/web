import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const baseUploadDir = path.resolve(process.cwd(), 'uploads');
mkdirSync(baseUploadDir, { recursive: true });

const yearParamSchema = z.string().regex(/^\d{4}$/);
const monthParamSchema = z.string().regex(/^(0[1-9]|1[0-2])$/);

const filenameParamSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-zA-Z0-9._-]+$/);

const ensureAdmin = (req, res) => {
  if (!req.user?.isAdmin) {
    res.status(403).json({
      message: 'Only the administrator can upload images.',
    });
    return false;
  }

  return true;
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const uploadDir = path.resolve(baseUploadDir, year, month);

    mkdirSync(uploadDir, { recursive: true });

    req.uploadPath = { year, month };
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);

    const baseName = safeBaseName || 'image';
    const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
    callback(null, `${baseName}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      !allowedExtensions.has(extension) ||
      !allowedMimeTypes.has(file.mimetype)
    ) {
      callback(
        new Error('Only jpg, jpeg, png, gif and webp image files are allowed.'),
      );
      return;
    }

    callback(null, true);
  },
});

router.post('/upload', requireAuth, (req, res, next) => {
  if (!ensureAdmin(req, res)) return;

  upload.single('image')(req, res, (error) => {
    if (error) {
      if (
        error instanceof multer.MulterError &&
        error.code === 'LIMIT_FILE_SIZE'
      ) {
        return res
          .status(400)
          .json({ message: 'File size must be 10MB or less.' });
      }

      return res
        .status(400)
        .json({ message: error.message ?? 'File upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          'Image file is required. Use multipart/form-data with "image" field.',
      });
    }

    return res.status(201).json({
      image: {
        year: req.uploadPath?.year,
        month: req.uploadPath?.month,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/api/images/${req.uploadPath?.year}/${req.uploadPath?.month}/${encodeURIComponent(req.file.filename)}`,
      },
    });
  });
});

router.get('/:year/:month/:filename', (req, res, next) => {
  try {
    const year = yearParamSchema.parse(req.params.year);
    const month = monthParamSchema.parse(req.params.month);
    const filename = filenameParamSchema.parse(req.params.filename);
    const filePath = path.resolve(baseUploadDir, year, month, filename);

    if (!filePath.startsWith(`${baseUploadDir}${path.sep}`)) {
      return res.status(400).json({ message: 'Invalid file path.' });
    }

    return res.sendFile(filePath, (error) => {
      if (!error) return;

      if (error.code === 'ENOENT') {
        if (!res.headersSent) {
          res.status(404).json({ message: 'Image not found.' });
        }
        return;
      }

      return next(error);
    });
  } catch (error) {
    return next(error);
  }
});

export default router;

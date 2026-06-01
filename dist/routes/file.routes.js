import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.middleware.js';
import { deleteFile, downloadFile, uploadFile, } from '../controllers/file.controller.js';
const router = Router();
// Storage config
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});
// 📦 File filter
const fileFilter = (_req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'video/mp4',
        'audio/mpeg',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type'));
    }
};
// ⚙️ Multer config
const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB
    },
    fileFilter,
});
// 🔐 Routes
router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/download/:fileId', authenticate, downloadFile);
router.delete('/:fileId', authenticate, deleteFile);
export default router;
//# sourceMappingURL=file.routes.js.map
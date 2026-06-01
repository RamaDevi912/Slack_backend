import prisma from '../config/database.js';
import fs from 'fs';
import { AuthenticationError, NotFoundError, ValidationError, } from '../utils/errors.js';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export class FileService {
    /**
     * Validate file
     */
    validateFile(file) {
        if (!file) {
            throw new ValidationError('File required');
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new ValidationError('File too large');
        }
    }
    /**
     * Upload file
     */
    async uploadFile(userId, file) {
        this.validateFile(file);
        return prisma.fileUpload.create({
            data: {
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                uploadedBy: userId,
                filePath: file.path,
            },
        });
    }
    /**
     * Get single file
     */
    async getFile(fileId) {
        const file = await prisma.fileUpload.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new NotFoundError('File');
        }
        return file;
    }
    /**
     * Download file
     */
    async downloadFile(fileId) {
        const file = await this.getFile(fileId);
        if (!fs.existsSync(file.filePath)) {
            throw new NotFoundError('File not found on disk');
        }
        const stream = fs.createReadStream(file.filePath);
        return { file, stream };
    }
    /**
     * Delete file
     */
    async deleteFile(fileId, userId) {
        const file = await this.getFile(fileId);
        if (file.uploadedBy !== userId) {
            throw new AuthenticationError('Not allowed');
        }
        // delete from disk
        if (fs.existsSync(file.filePath)) {
            fs.unlinkSync(file.filePath);
        }
        return prisma.fileUpload.delete({
            where: { id: fileId },
        });
    }
    /**
     * Get all files (admin/debug)
     */
    async getFiles() {
        return prisma.fileUpload.findMany({
            orderBy: { uploadedAt: 'desc' },
        });
    }
    /**
     * Delete multiple files
     */
    async deleteMultipleFiles(fileIds, userId) {
        const files = await prisma.fileUpload.findMany({
            where: { id: { in: fileIds } },
        });
        // check ownership
        const invalid = files.some((f) => f.uploadedBy !== userId);
        if (invalid) {
            throw new AuthenticationError('Not allowed');
        }
        // delete from disk
        for (const file of files) {
            if (fs.existsSync(file.filePath)) {
                fs.unlinkSync(file.filePath);
            }
        }
        const result = await prisma.fileUpload.deleteMany({
            where: { id: { in: fileIds } },
        });
        return { deletedCount: result.count };
    }
}
export default new FileService();
//# sourceMappingURL=file.service.js.map
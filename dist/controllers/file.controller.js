import fileService from '../services/file.service.js';
/**
 * Upload file
 */
export const uploadFile = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: 'No file provided' });
            return;
        }
        const file = await fileService.uploadFile(req.user.id, req.file);
        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            data: file,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Download file
 */
export const downloadFile = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const { file, stream } = await fileService.downloadFile(fileId);
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        stream.pipe(res);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Get file details
 */
export const getFile = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const file = await fileService.getFile(fileId);
        res.json({
            success: true,
            data: file,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Delete file
 */
export const deleteFile = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { fileId } = req.params;
        await fileService.deleteFile(fileId, req.user.id);
        res.json({
            success: true,
            message: 'File deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Delete multiple files
 */
export const deleteMultipleFiles = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { fileIds } = req.body;
        const result = await fileService.deleteMultipleFiles(fileIds, req.user.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=file.controller.js.map
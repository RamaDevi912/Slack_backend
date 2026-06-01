import fs from 'fs';
export declare class FileService {
    /**
     * Validate file
     */
    validateFile(file: any): void;
    /**
     * Upload file
     */
    uploadFile(userId: string, file: any): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedBy: string;
        uploadedAt: Date;
        filePath: string;
    }>;
    /**
     * Get single file
     */
    getFile(fileId: string): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedBy: string;
        uploadedAt: Date;
        filePath: string;
    }>;
    /**
     * Download file
     */
    downloadFile(fileId: string): Promise<{
        file: {
            id: string;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            uploadedBy: string;
            uploadedAt: Date;
            filePath: string;
        };
        stream: fs.ReadStream;
    }>;
    /**
     * Delete file
     */
    deleteFile(fileId: string, userId: string): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedBy: string;
        uploadedAt: Date;
        filePath: string;
    }>;
    /**
     * Get all files (admin/debug)
     */
    getFiles(): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedBy: string;
        uploadedAt: Date;
        filePath: string;
    }[]>;
    /**
     * Delete multiple files
     */
    deleteMultipleFiles(fileIds: string[], userId: string): Promise<{
        deletedCount: number;
    }>;
}
declare const _default: FileService;
export default _default;
//# sourceMappingURL=file.service.d.ts.map
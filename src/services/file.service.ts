import prisma from '../config/database.js';
import fs from 'fs';
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from '../utils/errors.js';

// ── Constants ──

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// ── Service Functions ──

export const validateFile = (file: any) => {
  if (!file) {
    throw new ValidationError('File required');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError('File too large');
  }
};

export const uploadFile = async (userId: string, file: any) => {
  validateFile(file);

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
};

export const getFile = async (fileId: string) => {
  const file = await prisma.fileUpload.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    throw new NotFoundError('File');
  }

  return file;
};

export const downloadFile = async (fileId: string) => {
  const file = await getFile(fileId);

  if (!fs.existsSync(file.filePath)) {
    throw new NotFoundError('File not found on disk');
  }

  const stream = fs.createReadStream(file.filePath);

  return { file, stream };
};

export const deleteFile = async (fileId: string, userId: string) => {
  const file = await getFile(fileId);

  if (file.uploadedBy !== userId) {
    throw new AuthenticationError('Not allowed');
  }

  if (fs.existsSync(file.filePath)) {
    fs.unlinkSync(file.filePath);
  }

  return prisma.fileUpload.delete({
    where: { id: fileId },
  });
};

export const getFiles = async () => {
  return prisma.fileUpload.findMany({
    orderBy: { uploadedAt: 'desc' },
  });
};

export const deleteMultipleFiles = async (fileIds: string[], userId: string) => {
  const files = await prisma.fileUpload.findMany({
    where: { id: { in: fileIds } },
  });

  const invalid = files.some((f) => f.uploadedBy !== userId);

  if (invalid) {
    throw new AuthenticationError('Not allowed');
  }

  for (const file of files) {
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }
  }

  const result = await prisma.fileUpload.deleteMany({
    where: { id: { in: fileIds } },
  });

  return { deletedCount: result.count };
};


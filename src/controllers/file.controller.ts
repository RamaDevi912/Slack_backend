import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import prisma from '../config/database'

// Auth request type
interface AuthRequest extends Request {
  user?: { id: string }
  file?: Express.Multer.File
}

// Upload file
export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file provided' })
      return
    }

    const file = req.file
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const fileUpload = await prisma.fileUpload.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        uploadedBy: userId,
        filePath: file.path,
      },
    })

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: fileUpload.id,
        filename: fileUpload.filename,
        originalName: fileUpload.originalName,
        size: fileUpload.size,
        mimeType: fileUpload.mimeType,
        uploadedAt: fileUpload.uploadedAt,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to upload file', error: error.message })
  }
}

// Download file
export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params

    const file = await prisma.fileUpload.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      res.status(404).json({ message: 'File not found' })
      return
    }

    const filePath = path.join(process.cwd(), file.filePath)

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'File not found on disk' })
      return
    }

    res.download(filePath, file.originalName)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to download file', error: error.message })
  }
}

// Delete file
export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const file = await prisma.fileUpload.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      res.status(404).json({ message: 'File not found' })
      return
    }

    if (file.uploadedBy !== userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    const filePath = path.join(process.cwd(), file.filePath)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await prisma.fileUpload.delete({
      where: { id: fileId },
    })

    res.json({ message: 'File deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete file', error: error.message })
  }
}
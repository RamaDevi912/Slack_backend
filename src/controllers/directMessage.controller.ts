import { NextFunction, Response } from 'express';
import directMessageService from '../services/directMessage.service.js';
import { AuthRequest } from '../types/index.js';

/**
 * Create or get DM room
 */
export const getOrCreateConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { workspaceId, recipientId } = req.body;

    const room = await directMessageService.getOrCreateRoom(
      workspaceId,
      req.user.id,
      recipientId,
    );

    res.status(200).json({
      success: true,
      message: 'Room retrieved',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send message
 */
export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { roomId } = req.params;
    const { receiverId, content } = req.body;

    const message = await directMessageService.sendMessage(
      roomId,
      req.user.id,
      receiverId,
      content,
    );

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get messages
 */
export const getMessageHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { roomId } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const messages = await directMessageService.getMessages(
      roomId,
      req.user.id,
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user rooms
 */
export const getUserConversations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { workspaceId } = req.params;

    const rooms = await directMessageService.getUserRooms(
      workspaceId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete message
 */
export const deleteMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    await directMessageService.deleteMessage(messageId, userId!);

    res.status(200).json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update DM Message
 */
export const updateDirectMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    const message = await directMessageService.updateMessage(messageId, userId!, content);

    res.status(200).json({
      success: true,
      message: 'Message updated',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add DM Reaction
 */
export const addDMReaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user?.id;

    const reaction = await directMessageService.addReaction(messageId, userId!, emoji);

    res.status(201).json({
      success: true,
      message: 'Reaction added',
      data: reaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove DM Reaction
 */
export const removeDMReaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user?.id;

    const result = await directMessageService.removeReaction(messageId, userId!, emoji);

    res.status(200).json({
      success: true,
      message: 'Reaction removed',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Aliases for Router Compatibility
export const getOrCreateDMRoom = getOrCreateConversation;
export const getDMRooms = getUserConversations;
export const sendDirectMessage = sendMessage;
export const getDMMessages = getMessageHistory;
export const deleteDirectMessage = deleteMessage;

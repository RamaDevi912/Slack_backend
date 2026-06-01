import { NextFunction, Response } from 'express';
import { channelService } from '../services/index.service.js';
import { AuthRequest } from '../types/index.js';

/**
 * Create channel
 */
export const createChannel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { name, description, isPrivate } = req.body;
    const userId = req.user?.id;

    const channel = await channelService.createChannel(workspaceId, userId!, {
      name,
      description,
      isPrivate,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Channel created successfully',
      data: channel,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get channels
 */
export const getChannels = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.id;

    const channels = await channelService.getChannels(workspaceId, userId!);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Channels retrieved successfully',
      data: channels,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single channel
 */
export const getChannelById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;

    const channel = await channelService.getChannelById(channelId, userId!);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Channel retrieved successfully',
      data: channel,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update channel
 */
export const updateChannel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    const channel = await channelService.updateChannel(
      channelId,
      userId!,
      updates,
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Channel updated successfully',
      data: channel,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete channel
 */
export const deleteChannel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;

    await channelService.deleteChannel(channelId, userId!);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Channel deleted successfully',
      data: null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to channel
 */
export const addMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;
    const { userId: targetUserId } = req.body;
    const userId = req.user?.id;

    const member = await channelService.addMember(
      channelId,
      userId!,
      targetUserId,
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Member added to channel',
      data: member,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from channel
 */
export const removeMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId, memberId } = req.params;
    const userId = req.user?.id;

    await channelService.removeMember(channelId, userId!, memberId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Member removed from channel',
      data: null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get channel members
 */
export const getMembers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;

    const members = await channelService.getMembers(channelId, userId!);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Members retrieved successfully',
      data: members,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Archive channel
 */
export const archiveChannel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;

    const channel = await channelService.archiveChannel(channelId, userId!);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Channel archived successfully',
      data: channel,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Join channel
 */
export const joinChannel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;

    const result = await channelService.joinChannel(channelId, userId!);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Joined channel successfully',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Leave channel
 */
export const leaveChannel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;

    const result = await channelService.leaveChannel(channelId, userId!);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Left channel successfully',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pinned messages
 */
export const getPinnedMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId } = req.params;

    const pinned = await channelService.getPinnedMessages(channelId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Pinned messages retrieved successfully',
      data: pinned,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Pin message
 */
export const pinMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId, messageId } = req.params;
    const userId = req.user?.id;

    const pinned = await channelService.pinMessage(channelId, messageId, userId!);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Message pinned successfully',
      data: pinned,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unpin message
 */
export const unpinMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { channelId, messageId } = req.params;

    const result = await channelService.unpinMessage(channelId, messageId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Message unpinned successfully',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// Aliases for Router Compatibility
export const getChannel = getChannelById;
export const addChannelMember = addMember;
export const removeChannelMember = removeMember;

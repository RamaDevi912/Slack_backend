import { Response } from 'express';
import * as searchService from '../services/search.service.js';
import { AuthRequest } from '../types/index.js';

/**
 * 🔍 Search Messages
 */
export const searchMessages = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { workspaceId } = req.params;
    const { query, page = '1', limit = '20' } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const result = await searchService.searchMessages(
      workspaceId,
      userId,
      query as string,
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * 👤 Search Users
 */
export const searchUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { workspaceId } = req.params;
    const { query, page = '1', limit = '20' } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const result = await searchService.searchUsers(
      workspaceId,
      userId,
      query as string,
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * 📁 Search Channels
 */
export const searchChannels = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { workspaceId } = req.params;
    const { query, page = '1', limit = '20' } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const result = await searchService.searchChannels(
      workspaceId,
      userId,
      query as string,
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * 💬 Search Direct Messages
 */
export const searchDirectMessages = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { workspaceId } = req.params;
    const { query, page = '1', limit = '20' } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const result = await searchService.searchMyMessages(
      userId,
      query as string,
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        workspaceId,
      },
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

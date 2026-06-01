import { NextFunction, Request, Response } from 'express';
import adminService from '../services/admin.service.js';

/**
 * Dashboard stats
 */
export const getPlatformStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get users
 */
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await adminService.getUserStats();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get workspaces
 */
export const getAllWorkspaces = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workspaces = await adminService.getWorkspaceStats();

    res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get audit logs
 */
export const getAuditLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page = '1', limit = '20' } = req.query;

    const logs = await adminService.getAuditLogs({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ban user
 */
export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await adminService.banUser(userId, reason);

    res.status(200).json({
      success: true,
      message: 'User banned',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unban user
 */
export const unbanUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await adminService.unbanUser(userId);

    res.status(200).json({
      success: true,
      message: 'User unbanned',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * System health
 */
export const getSystemHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const health = await adminService.getSystemHealth();

    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user details
 */
export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await adminService.getUserDetails(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Promote user to platform admin
 */
export const promoteToAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const admin = await adminService.promoteToAdmin(userId);

    res.status(200).json({
      success: true,
      message: 'User promoted to platform admin successfully',
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove platform admin privileges
 */
export const removeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await adminService.removeAdmin(userId);

    res.status(200).json({
      success: true,
      message: 'Platform admin privileges removed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get workspace details
 */
export const getWorkspaceDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const workspace = await adminService.getWorkspaceDetails(workspaceId);

    res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all channels
 */
export const getAllChannels = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const channels = await adminService.getAllChannels();

    res.status(200).json({
      success: true,
      data: channels,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get activity analytics
 */
export const getActivityAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const analytics = await adminService.getActivityAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

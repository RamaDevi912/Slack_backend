import { NextFunction, Response } from 'express';
import { WorkspaceRole } from '@prisma/client';
import { workspaceService } from '../services/index.service.js';
import { AuthRequest } from '../types/index.js';

/**
 * Create new workspace
 */
export const createWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, description, slug } = req.body;
    const userId = req.user?.id;

    const workspace = await workspaceService.createWorkspace({
      name,
      description,
      slug,
      createdBy: userId!,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Workspace created successfully',
      data: workspace,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's workspaces
 */
export const getUserWorkspaces = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const workspaces = await workspaceService.getUserWorkspaces(userId!);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Workspaces retrieved successfully',
      data: workspaces,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single workspace
 */
export const getWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId } = req.params;

    const workspace = await workspaceService.getWorkspaceById(workspaceId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Workspace retrieved successfully',
      data: workspace,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update workspace
 */
export const updateWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const updates = req.body;

    const workspace = await workspaceService.updateWorkspace(
      workspaceId,
      updates,
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Workspace updated successfully',
      data: workspace,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to workspace
 */
export const addMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { userId: targetUserId } = req.body;
    const userId = req.user?.id;

    const member = await workspaceService.addMember(
      workspaceId,
      userId!,
      targetUserId,
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Member added to workspace',
      data: member,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from workspace
 */
export const removeMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId, memberId } = req.params;

    await workspaceService.removeMember(workspaceId, memberId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Member removed from workspace',
      data: null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get workspace members
 */
export const getMembers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId } = req.params;

    const members = await workspaceService.getMembers(workspaceId);

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
 * Update member role
 */
export const updateMemberRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    const member = await workspaceService.updateMemberRole(
      workspaceId,
      memberId,
      role,
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Member role updated successfully',
      data: member,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Invite user to workspace
 */
export const inviteToWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { email, role = 'MEMBER' } = req.body;
    const invitedBy = req.user?.id;

    const invitation = await workspaceService.inviteUser({
      workspaceId,
      email,
      role: role as WorkspaceRole,
      invitedBy: invitedBy!,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Invitation sent successfully',
      data: invitation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};


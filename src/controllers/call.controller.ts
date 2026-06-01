import { NextFunction, Response } from 'express';
import callService from '../services/call.service.js';
import { AuthRequest } from '../types/index.js';

/**
 * Helper → avoid repeating auth check
 */
const getUserId = (req: AuthRequest): string => {
  if (!req.user?.id) {
    throw new Error('Unauthorized');
  }
  return req.user.id;
};

/**
 * Initiate call
 */
export const initiateCall = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    const { type, channelId } = req.body;

    const call = await callService.initiateCall(userId, { type, channelId });

    res.status(201).json({ message: 'Call initiated', data: call });
  } catch (error) {
    next(error);
  }
};

/**
 * Get call status
 */
export const getCallStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;

    const call = await callService.getCallStatus(callId);

    res.json(call);
  } catch (error) {
    next(error);
  }
};

/**
 * Accept call
 */
export const acceptCall = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { callId } = req.params;

    const call = await callService.acceptCall(callId, userId);

    res.json({ message: 'Call accepted', data: call });
  } catch (error) {
    next(error);
  }
};

/**
 * Decline call
 */
export const declineCall = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { callId } = req.params;

    const call = await callService.declineCall(callId, userId);

    res.json({ message: 'Call declined', data: call });
  } catch (error) {
    next(error);
  }
};

/**
 * End call
 */
export const endCall = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { callId } = req.params;

    const call = await callService.endCall(callId, userId);

    res.json({ message: 'Call ended', data: call });
  } catch (error) {
    next(error);
  }
};

/**
 * Call history
 */
export const getCallHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '20');

    const history = await callService.getCallHistory(userId, { page, limit });

    res.json(history);
  } catch (error) {
    next(error);
  }
};

/**
 * Add participant
 */
export const addParticipant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;
    const { userId } = req.body;

    const result = await callService.addParticipant(callId, userId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove participant
 */
export const removeParticipant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { callId, userId } = req.params;

    const result = await callService.removeParticipant(callId, userId);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Active calls
 */
export const getActiveCalls = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    const calls = await callService.getActiveCalls(userId);

    res.json(calls);
  } catch (error) {
    next(error);
  }
};

/**
 * Get active call in channel
 */
export const getChannelActiveCalls = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { channelId } = req.params;

    const call = await callService.getActiveCallInChannel(channelId);

    res.json(call);
  } catch (error) {
    next(error);
  }
};

/**
 * Leave call
 */
export const leaveCall = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { callId } = req.params;

    const call = await callService.leaveCall(callId, userId);

    res.json({ message: 'Left call successfully', data: call });
  } catch (error) {
    next(error);
  }
};

/**
 * Get call details
 */
export const getCall = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;

    const call = await callService.getCallStatus(callId);

    res.json(call);
  } catch (error) {
    next(error);
  }
};

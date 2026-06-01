import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Initiate call
 */
export declare const initiateCall: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get call status
 */
export declare const getCallStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Accept call
 */
export declare const acceptCall: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Decline call
 */
export declare const declineCall: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * End call
 */
export declare const endCall: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Call history
 */
export declare const getCallHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Add participant
 */
export declare const addParticipant: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Remove participant
 */
export declare const removeParticipant: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Active calls
 */
export declare const getActiveCalls: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get active call in channel
 */
export declare const getChannelActiveCalls: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Leave call
 */
export declare const leaveCall: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get call details
 */
export declare const getCall: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=call.controller.d.ts.map
import { NextFunction, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { Channel, PlatformAdmin, User, WorkspaceMember } from '@prisma/client';
export interface AuthRequest extends Request {
    user?: User;
    workspaceMember?: WorkspaceMember;
    channel?: Channel;
    platformAdmin?: PlatformAdmin;
    io?: SocketIOServer;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        status: string;
    };
}
export interface CreateMessageRequest {
    content: string;
    fileId?: string;
    threadId?: string;
}
export interface CreateWorkspaceRequest {
    name: string;
    description?: string;
}
export interface CreateChannelRequest {
    name: string;
    description?: string;
    isPrivate?: boolean;
}
export interface JWTPayload {
    userId: string;
    exp: number;
}
export interface FileUploadRequest {
    filename: string;
    mimetype: string;
    size: number;
    path?: string;
}
export interface SocketMessage {
    userId: string;
    content: string;
    channelId?: string;
    dmRoomId?: string;
    timestamp: Date;
}
export type RouteHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void> | void;
//# sourceMappingURL=index.d.ts.map
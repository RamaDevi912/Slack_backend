import { NextFunction, Request, Response } from 'express';
export interface AuthRequest extends Request {
    user?: any;
    workspaceMember?: any;
    channel?: any;
    platformAdmin?: any;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const hasWorkspaceAccess: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const isWorkspaceAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const hasChannelAccess: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const isPlatformAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map
import { JwtPayload } from 'jsonwebtoken';
declare const JWT_SECRET: string;
interface TokenPayload extends JwtPayload {
    userId: string;
}
export declare const generateToken: (userId: string) => string;
export declare const verifyToken: (token: string) => TokenPayload | null;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export { JWT_SECRET };
//# sourceMappingURL=auth.d.ts.map
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// 🔐 Env config
const JWT_SECRET: string = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const JWT_EXPIRY = '7d';

// 📌 Token payload type
interface TokenPayload extends JwtPayload {
  userId: string
}

// ✅ Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

// ✅ Verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

// 🔐 Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// 🔐 Compare password
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Export secret if needed elsewhere
export { JWT_SECRET };

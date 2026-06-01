import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// 🔐 Env config
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const JWT_EXPIRY = '7d';
// ✅ Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
    });
};
// ✅ Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
// 🔐 Hash password
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
// 🔐 Compare password
export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};
// Export secret if needed elsewhere
export { JWT_SECRET };
//# sourceMappingURL=auth.js.map
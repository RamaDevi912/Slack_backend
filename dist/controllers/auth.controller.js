import authService from '../services/auth.service.js';
/**
 * Register
 */
export const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json({
            message: 'Login successful',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Get current user
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await authService.getUserProfile(req.user.id);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Update profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await authService.updateProfile(req.user.id, req.body);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Change password
 */
export const changePassword = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { oldPassword, newPassword } = req.body;
        await authService.changePassword(req.user.id, oldPassword, newPassword);
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Refresh token
 */
export const refreshToken = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const result = await authService.refreshToken(req.user.id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Update user status
 */
export const updateStatus = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { status, customStatus } = req.body;
        const user = await authService.updateProfile(req.user.id, {
            status,
            customStatus,
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map
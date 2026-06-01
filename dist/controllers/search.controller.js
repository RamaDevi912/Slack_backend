import searchService from '../services/search.service.js';
/**
 * 🔍 Search Messages
 */
export const searchMessages = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { query, page = '1', limit = '20' } = req.query;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!query) {
            return res.status(400).json({ message: 'Search query required' });
        }
        const result = await searchService.searchMessages(workspaceId, userId, query, {
            page: parseInt(page),
            limit: parseInt(limit),
        });
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
/**
 * 👤 Search Users
 */
export const searchUsers = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { query, page = '1', limit = '20' } = req.query;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!query) {
            return res.status(400).json({ message: 'Search query required' });
        }
        const result = await searchService.searchUsers(workspaceId, userId, query, {
            page: parseInt(page),
            limit: parseInt(limit),
        });
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
/**
 * 📁 Search Channels
 */
export const searchChannels = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { query, page = '1', limit = '20' } = req.query;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!query) {
            return res.status(400).json({ message: 'Search query required' });
        }
        const result = await searchService.searchChannels(workspaceId, userId, query, {
            page: parseInt(page),
            limit: parseInt(limit),
        });
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
/**
 * 💬 Search Direct Messages
 */
export const searchDirectMessages = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { query, page = '1', limit = '20' } = req.query;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!query) {
            return res.status(400).json({ message: 'Search query required' });
        }
        const result = await searchService.searchMyMessages(userId, query, {
            page: parseInt(page),
            limit: parseInt(limit),
            workspaceId,
        });
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=search.controller.js.map
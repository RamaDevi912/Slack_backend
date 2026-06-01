import messageService from '../services/message.service.js';
/**
 * Send message
 */
export const createMessage = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { channelId } = req.params;
        const { content, attachments } = req.body;
        if (!content && (!attachments || attachments.length === 0)) {
            res.status(400).json({ message: 'Content or attachment required' });
            return;
        }
        const message = await messageService.sendMessage(channelId, req.user.id, {
            content,
            attachments,
        });
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Get messages
 */
export const getMessages = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { channelId } = req.params;
        const { page = '1', limit = '20' } = req.query;
        const result = await messageService.getMessages(channelId, req.user.id, {
            page: parseInt(page),
            limit: parseInt(limit),
        });
        res.json({
            success: true,
            data: result.messages,
            pagination: result.pagination,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Update message
 */
export const updateMessage = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { messageId } = req.params;
        const { content } = req.body;
        const message = await messageService.updateMessage(messageId, req.user.id, { content });
        res.json({
            success: true,
            message: 'Message updated',
            data: message,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Delete message
 */
export const deleteMessage = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { messageId } = req.params;
        await messageService.deleteMessage(messageId, req.user.id);
        res.json({
            success: true,
            message: 'Message deleted',
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Add reaction
 */
export const addReaction = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { messageId } = req.params;
        const { emoji } = req.body;
        const reaction = await messageService.addReaction(messageId, req.user.id, emoji);
        res.status(201).json({
            success: true,
            message: 'Reaction added',
            data: reaction,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Remove reaction
 */
export const removeReaction = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { reactionId } = req.params;
        await messageService.removeReaction(reactionId, req.user.id);
        res.json({
            success: true,
            message: 'Reaction removed',
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Reply
 */
export const createReply = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { messageId } = req.params;
        const { content } = req.body;
        const reply = await messageService.replyToMessage(messageId, req.user.id, { content });
        res.status(201).json({
            success: true,
            message: 'Reply created',
            data: reply,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Thread
 */
export const getThreadReplies = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { messageId } = req.params;
        const thread = await messageService.getThread(messageId, req.user.id);
        res.json({
            success: true,
            data: thread,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Mark channel as read
 */
export const markChannelAsRead = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { channelId } = req.params;
        const member = await messageService.markChannelAsRead(channelId, req.user.id);
        res.json({
            success: true,
            message: 'Channel marked as read',
            data: member,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=message.controller.js.map
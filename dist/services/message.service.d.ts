export declare class MessageService {
    /**
     * Send message
     */
    sendMessage(channelId: string, userId: string, data: {
        content: string;
        attachments?: string[];
    }): Promise<{
        user: {
            id: string;
            username: string;
            profilePicture: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        channelId: string;
        content: string;
        attachments: string[];
        editedAt: Date | null;
        deletedAt: Date | null;
    }>;
    /**
     * Get messages
     */
    getMessages(channelId: string, userId: string, options: {
        page?: number;
        limit?: number;
    }): Promise<{
        messages: ({
            user: {
                id: string;
                username: string;
                profilePicture: string | null;
            };
            replies: ({
                user: {
                    id: string;
                    username: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                messageId: string;
                content: string;
                attachments: string[];
                editedAt: Date | null;
                deletedAt: Date | null;
            })[];
            reactions: {
                id: string;
                createdAt: Date;
                userId: string;
                messageId: string;
                emoji: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            channelId: string;
            content: string;
            attachments: string[];
            editedAt: Date | null;
            deletedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    /**
     * Update message
     */
    updateMessage(messageId: string, userId: string, data: {
        content: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        channelId: string;
        content: string;
        attachments: string[];
        editedAt: Date | null;
        deletedAt: Date | null;
    }>;
    /**
     * Delete message
     */
    deleteMessage(messageId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Add reaction (no duplicates)
     */
    addReaction(messageId: string, userId: string, emoji: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        messageId: string;
        emoji: string;
    }>;
    /**
     * Remove reaction
     */
    removeReaction(reactionId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Reply to message (FIXED)
     */
    replyToMessage(messageId: string, userId: string, data: {
        content: string;
    }): Promise<{
        user: {
            id: string;
            username: string;
            profilePicture: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messageId: string;
        content: string;
        attachments: string[];
        editedAt: Date | null;
        deletedAt: Date | null;
    }>;
    /**
     * Get thread (secure)
     */
    getThread(messageId: string, userId: string): Promise<{
        channel: {
            members: {
                id: string;
                userId: string;
                role: import(".prisma/client").$Enums.ChannelRole;
                joinedAt: Date;
                channelId: string;
                unreadMessages: number;
                lastReadMessageId: string | null;
                lastReadAt: Date | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            createdBy: string;
            workspaceId: string;
            isPrivate: boolean;
            topic: string | null;
            archivedAt: Date | null;
        };
        replies: ({
            user: {
                id: string;
                username: string;
                profilePicture: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messageId: string;
            content: string;
            attachments: string[];
            editedAt: Date | null;
            deletedAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        channelId: string;
        content: string;
        attachments: string[];
        editedAt: Date | null;
        deletedAt: Date | null;
    }>;
    /**
     * Mark channel as read
     */
    markChannelAsRead(channelId: string, userId: string): Promise<{
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.ChannelRole;
        joinedAt: Date;
        channelId: string;
        unreadMessages: number;
        lastReadMessageId: string | null;
        lastReadAt: Date | null;
    }>;
}
declare const _default: MessageService;
export default _default;
//# sourceMappingURL=message.service.d.ts.map
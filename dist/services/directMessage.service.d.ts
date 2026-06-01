export declare class DirectMessageService {
    /**
     * Create or get room
     */
    getOrCreateRoom(workspaceId: string, userId: string, recipientId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        participantIds: string[];
    }>;
    /**
     * Send message
     */
    sendMessage(roomId: string, senderId: string, receiverId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        content: string;
        attachments: string[];
        editedAt: Date | null;
        deletedAt: Date | null;
        isRead: boolean;
        readAt: Date | null;
        roomId: string;
        senderId: string;
        receiverId: string;
    }>;
    /**
     * Get messages
     */
    getMessages(roomId: string, userId: string, options: {
        page?: number;
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        content: string;
        attachments: string[];
        editedAt: Date | null;
        deletedAt: Date | null;
        isRead: boolean;
        readAt: Date | null;
        roomId: string;
        senderId: string;
        receiverId: string;
    }[]>;
    /**
     * Get user rooms
     */
    getUserRooms(workspaceId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        participantIds: string[];
    }[]>;
    /**
     * Delete message
     */
    deleteMessage(messageId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Update message
     */
    updateMessage(messageId: string, userId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        content: string;
        attachments: string[];
        editedAt: Date | null;
        deletedAt: Date | null;
        isRead: boolean;
        readAt: Date | null;
        roomId: string;
        senderId: string;
        receiverId: string;
    }>;
    /**
     * Add reaction
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
    removeReaction(messageId: string, userId: string, emoji: string): Promise<{
        message: string;
    }>;
}
declare const _default: DirectMessageService;
export default _default;
//# sourceMappingURL=directMessage.service.d.ts.map
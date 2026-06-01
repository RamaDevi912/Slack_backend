export declare class ChannelService {
    /**
     * Create channel
     */
    createChannel(workspaceId: string, userId: string, data: {
        name: string;
        description?: string;
        isPrivate?: boolean;
    }): Promise<{
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
    }>;
    /**
     * Get channels
     */
    getChannels(workspaceId: string, userId: string): Promise<({
        _count: {
            members: number;
        };
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
    })[]>;
    /**
     * Get single channel
     */
    getChannelById(channelId: string, userId: string): Promise<{
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
    }>;
    /**
     * Update channel
     */
    updateChannel(channelId: string, userId: string, data: {
        name?: string;
        description?: string;
        topic?: string;
    }): Promise<{
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
    }>;
    /**
     * Delete channel
     */
    deleteChannel(channelId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Add member
     */
    addMember(channelId: string, userId: string, targetUserId: string): Promise<{
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.ChannelRole;
        joinedAt: Date;
        channelId: string;
        unreadMessages: number;
        lastReadMessageId: string | null;
        lastReadAt: Date | null;
    }>;
    /**
     * Remove member
     */
    removeMember(channelId: string, userId: string, targetUserId: string): Promise<{
        message: string;
    }>;
    /**
     * Get members
     */
    getMembers(channelId: string, userId: string): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
            profilePicture: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
        };
    } & {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.ChannelRole;
        joinedAt: Date;
        channelId: string;
        unreadMessages: number;
        lastReadMessageId: string | null;
        lastReadAt: Date | null;
    })[]>;
    /**
     * Archive channel
     */
    archiveChannel(channelId: string, userId: string): Promise<{
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
    }>;
    /**
     * Join channel
     */
    joinChannel(channelId: string, userId: string): Promise<{
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.ChannelRole;
        joinedAt: Date;
        channelId: string;
        unreadMessages: number;
        lastReadMessageId: string | null;
        lastReadAt: Date | null;
    }>;
    /**
     * Leave channel
     */
    leaveChannel(channelId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Get pinned messages
     */
    getPinnedMessages(channelId: string): Promise<({
        message: {
            user: {
                id: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
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
        };
    } & {
        id: string;
        createdAt: Date;
        channelId: string;
        messageId: string;
        pinnedBy: string;
    })[]>;
    /**
     * Pin message
     */
    pinMessage(channelId: string, messageId: string, pinnedBy: string): Promise<{
        id: string;
        createdAt: Date;
        channelId: string;
        messageId: string;
        pinnedBy: string;
    }>;
    /**
     * Unpin message
     */
    unpinMessage(channelId: string, messageId: string): Promise<{
        message: string;
    }>;
}
declare const _default: ChannelService;
export default _default;
//# sourceMappingURL=channel.service.d.ts.map
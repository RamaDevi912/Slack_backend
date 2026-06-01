export declare class SearchService {
    /**
     * Search Messages
     */
    searchMessages(workspaceId: string, userId: string, query: string, options: {
        page?: number;
        limit?: number;
        channelId?: string;
        fromDate?: Date;
        toDate?: Date;
    }): Promise<{
        results: ({
            user: {
                id: string;
                username: string;
                profilePicture: string | null;
            };
            channel: {
                id: string;
                name: string;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        query: string;
    }>;
    /**
     * 👤 Search Users
     */
    searchUsers(workspaceId: string, userId: string, query: string, options: {
        page?: number;
        limit?: number;
    }): Promise<{
        results: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            profilePicture: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        query: string;
    }>;
    /**
     * 📁 Search Channels
     */
    searchChannels(workspaceId: string, userId: string, query: string, options: {
        page?: number;
        limit?: number;
    }): Promise<{
        results: ({
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        query: string;
    }>;
    /**
     * 🌍 Global Search
     */
    globalSearch(workspaceId: string, userId: string, query: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            channelId: string;
            content: string;
            attachments: string[];
            editedAt: Date | null;
            deletedAt: Date | null;
        }[];
        users: {
            id: string;
            email: string;
            username: string;
            passwordHash: string;
            firstName: string | null;
            lastName: string | null;
            profilePicture: string | null;
            bio: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            accountStatus: import(".prisma/client").$Enums.AccountStatus;
            lastActiveAt: Date | null;
            banReason: string | null;
            customStatus: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        channels: {
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
        }[];
    }>;
    /**
     * 💬 Search My Messages
     */
    searchMyMessages(userId: string, query: string, options: {
        page?: number;
        limit?: number;
        workspaceId?: string;
    }): Promise<{
        results: ({
            channel: {
                id: string;
                name: string;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        query: string;
    }>;
}
declare const _default: SearchService;
export default _default;
//# sourceMappingURL=search.service.d.ts.map
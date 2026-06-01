export declare class AdminService {
    /**
     * Dashboard statistics
     */
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalWorkspaces: number;
        totalChannels: number;
        totalMessages: number;
        totalDirectMessages: number;
        activeCalls: number;
        recentUsers: {
            id: string;
            email: string;
            username: string;
            createdAt: Date;
        }[];
        timestamp: Date;
    }>;
    /**
     * Get all users
     */
    getUserStats(): Promise<{
        userId: string;
        username: string;
        email: string;
        messagesCount: number;
        workspacesCount: number;
        directMessagesCount: number;
        createdAt: Date;
        lastActiveAt: Date | null;
    }[]>;
    /**
     * Get all workspaces
     */
    getWorkspaceStats(): Promise<{
        workspaceId: string;
        name: string;
        membersCount: number;
        channelsCount: number;
        createdAt: Date;
        admin: {
            id: string;
            email: string;
            username: string;
        };
    }[]>;
    /**
     * Get audit logs
     */
    getAuditLogs(options: {
        page?: number;
        limit?: number;
    }): Promise<{
        logs: {
            id: string;
            createdAt: Date;
            workspaceId: string;
            userId: string | null;
            action: string;
            entityType: string;
            entityId: string | null;
            changes: string | null;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    /**
     * Ban user
     */
    banUser(userId: string, reason: string): Promise<{
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
    }>;
    /**
     * Unban user
     */
    unbanUser(userId: string): Promise<{
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
    }>;
    /**
     * System health
     */
    getSystemHealth(): Promise<{
        status: string;
        database: string;
        uptime: number;
        timestamp: Date;
    } | {
        status: string;
        database: string;
        timestamp: Date;
        uptime?: undefined;
    }>;
    /**
     * Get user details
     */
    getUserDetails(userId: string): Promise<{
        workspaceMembers: ({
            workspace: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                logo: string | null;
                createdBy: string;
            };
        } & {
            id: string;
            workspaceId: string;
            userId: string;
            role: import(".prisma/client").$Enums.WorkspaceRole;
            joinedAt: Date;
        })[];
        platformAdmin: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            role: import(".prisma/client").$Enums.AdminRole;
        } | null;
    } & {
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
    }>;
    /**
     * Promote user to platform admin
     */
    promoteToAdmin(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        role: import(".prisma/client").$Enums.AdminRole;
    }>;
    /**
     * Remove platform admin privileges
     */
    removeAdmin(userId: string): Promise<{
        message: string;
    }>;
    /**
     * Get workspace details
     */
    getWorkspaceDetails(workspaceId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                username: string;
            };
        } & {
            id: string;
            workspaceId: string;
            userId: string;
            role: import(".prisma/client").$Enums.WorkspaceRole;
            joinedAt: Date;
        })[];
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        logo: string | null;
        createdBy: string;
    }>;
    /**
     * Get all channels across the platform
     */
    getAllChannels(): Promise<({
        _count: {
            messages: number;
            members: number;
        };
        workspace: {
            id: string;
            name: string;
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
     * Get activity analytics
     */
    getActivityAnalytics(): Promise<{
        messagesCount: number;
        directMessagesCount: number;
        callsCount: number;
        timestamp: Date;
    }>;
}
declare const _default: AdminService;
export default _default;
//# sourceMappingURL=admin.service.d.ts.map
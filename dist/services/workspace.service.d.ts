import { WorkspaceRole } from '@prisma/client';
export declare class WorkspaceService {
    /**
     * Create a new workspace
     */
    createWorkspace(data: {
        name: string;
        description?: string;
        slug?: string;
        createdBy: string;
    }): Promise<{
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
     * Get workspace by ID
     */
    getWorkspaceById(workspaceId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
                profilePicture: string | null;
                status: import(".prisma/client").$Enums.UserStatus;
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
     * Get user's workspaces
     */
    getUserWorkspaces(userId: string): Promise<({
        members: {
            id: string;
            workspaceId: string;
            userId: string;
            role: import(".prisma/client").$Enums.WorkspaceRole;
            joinedAt: Date;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        logo: string | null;
        createdBy: string;
    })[]>;
    /**
     * Update workspace
     */
    updateWorkspace(workspaceId: string, data: {
        name?: string;
        description?: string;
    }): Promise<{
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
     * Add member to workspace
     */
    addMember(workspaceId: string, userId: string, role?: WorkspaceRole): Promise<{
        id: string;
        workspaceId: string;
        userId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    }>;
    /**
     * Remove member from workspace
     */
    removeMember(workspaceId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Update member role
     */
    updateMemberRole(workspaceId: string, userId: string, role: WorkspaceRole): Promise<{
        id: string;
        workspaceId: string;
        userId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    }>;
    /**
     * Get workspace members
     */
    getMembers(workspaceId: string): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            profilePicture: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
        };
    } & {
        id: string;
        workspaceId: string;
        userId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    })[]>;
    /**
     * Send workspace invitation
     */
    inviteUser(data: {
        workspaceId: string;
        email: string;
        role: WorkspaceRole;
        invitedBy: string;
    }): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        workspaceId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        invitedBy: string;
        expiresAt: Date;
        used: boolean;
        usedAt: Date | null;
    }>;
}
declare const _default: WorkspaceService;
export default _default;
//# sourceMappingURL=workspace.service.d.ts.map
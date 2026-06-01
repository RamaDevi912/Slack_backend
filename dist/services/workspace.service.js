import prisma from '../config/database.js';
import { ConflictError, ErrorCode, NotFoundError } from '../utils/errors.js';
import { generateSlug } from '../utils/slug.js';
export class WorkspaceService {
    /**
     * Create a new workspace
     */
    async createWorkspace(data) {
        // Generate slug automatically from name if not provided
        let slug = data.slug;
        if (!slug || slug.trim() === '') {
            slug = generateSlug(data.name);
        }
        // Standardize slug to be lowercase
        slug = slug.toLowerCase().trim();
        // Ensure the slug is unique by appending incremental indices if conflicts exist
        let uniqueSlug = slug;
        let counter = 1;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const existingWorkspace = await prisma.workspace.findUnique({
                where: { slug: uniqueSlug },
            });
            if (!existingWorkspace) {
                break;
            }
            // If collision occurs and user provided a specific slug, throw error to notify them
            if (data.slug) {
                throw new ConflictError('Workspace slug already exists', ErrorCode.WORKSPACE_SLUG_EXISTS);
            }
            // If slug was auto-generated, append a clean incremental suffix to maintain user flow
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        // Create workspace with the resolved unique slug
        const workspace = await prisma.workspace.create({
            data: {
                name: data.name,
                description: data.description,
                slug: uniqueSlug,
                createdBy: data.createdBy,
            },
        });
        // Add creator as owner
        await prisma.workspaceMember.create({
            data: {
                workspaceId: workspace.id,
                userId: data.createdBy,
                role: 'OWNER',
            },
        });
        return workspace;
    }
    /**
     * Get workspace by ID
     */
    async getWorkspaceById(workspaceId) {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                                status: true,
                            },
                        },
                    },
                },
                channels: {
                    where: { archivedAt: null },
                },
            },
        });
        if (!workspace) {
            throw new NotFoundError('Workspace');
        }
        return workspace;
    }
    /**
     * Get user's workspaces
     */
    async getUserWorkspaces(userId) {
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                members: {
                    where: { userId },
                },
                channels: {
                    where: { archivedAt: null },
                },
            },
        });
        return workspaces;
    }
    /**
     * Update workspace
     */
    async updateWorkspace(workspaceId, data) {
        const workspace = await prisma.workspace.update({
            where: { id: workspaceId },
            data,
        });
        return workspace;
    }
    /**
     * Add member to workspace
     */
    async addMember(workspaceId, userId, role = 'MEMBER') {
        // Check if user already exists
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId },
            },
        });
        if (existingMember) {
            throw new ConflictError('User already a member of this workspace', ErrorCode.DUPLICATE_MEMBER);
        }
        const member = await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId,
                role,
            },
        });
        return member;
    }
    /**
     * Remove member from workspace
     */
    async removeMember(workspaceId, userId) {
        await prisma.workspaceMember.delete({
            where: {
                workspaceId_userId: { workspaceId, userId },
            },
        });
        return { message: 'Member removed successfully' };
    }
    /**
     * Update member role
     */
    async updateMemberRole(workspaceId, userId, role) {
        const member = await prisma.workspaceMember.update({
            where: {
                workspaceId_userId: { workspaceId, userId },
            },
            data: { role },
        });
        return member;
    }
    /**
     * Get workspace members
     */
    async getMembers(workspaceId) {
        const members = await prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                        status: true,
                    },
                },
            },
        });
        return members;
    }
    /**
     * Send workspace invitation
     */
    async inviteUser(data) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry
        const invitation = await prisma.workspaceInvitation.upsert({
            where: {
                workspaceId_email: {
                    workspaceId: data.workspaceId,
                    email: data.email,
                },
            },
            update: {
                expiresAt,
                used: false,
            },
            create: {
                workspaceId: data.workspaceId,
                email: data.email,
                role: data.role,
                invitedBy: data.invitedBy,
                expiresAt,
            },
        });
        return invitation;
    }
}
export default new WorkspaceService();
//# sourceMappingURL=workspace.service.js.map
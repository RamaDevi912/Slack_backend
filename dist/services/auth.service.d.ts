export declare class AuthService {
    /**
     * Register
     */
    register(data: {
        email: string;
        username: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            username: any;
            firstName: any;
            lastName: any;
            status: any;
            accountStatus: any;
        };
    }>;
    /**
     * Login
     */
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            username: any;
            firstName: any;
            lastName: any;
            status: any;
            accountStatus: any;
        };
    }>;
    /**
     * Get profile
     */
    getUserProfile(userId: string): Promise<{
        id: any;
        email: any;
        username: any;
        firstName: any;
        lastName: any;
        status: any;
        accountStatus: any;
    }>;
    /**
     * Update profile
     */
    updateProfile(userId: string, data: any): Promise<{
        id: any;
        email: any;
        username: any;
        firstName: any;
        lastName: any;
        status: any;
        accountStatus: any;
    }>;
    /**
     * Change password
     */
    changePassword(userId: string, oldPass: string, newPass: string): Promise<void>;
    /**
     * Refresh token
     */
    refreshToken(userId: string): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            username: any;
            firstName: any;
            lastName: any;
            status: any;
            accountStatus: any;
        };
    }>;
    /**
     * Reusable formatter
     */
    private formatUser;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map
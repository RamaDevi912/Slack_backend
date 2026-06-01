import prisma from '../config/database.js';
import { comparePassword, generateToken, hashPassword } from '../utils/auth.js';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.js';
import { AccountStatus, UserStatus } from '@prisma/client';

export class AuthService {
  /**
   * Register
   */
  async register(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new ConflictError('Email or username already exists');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        accountStatus: AccountStatus.ACTIVE,
        status: UserStatus.OFFLINE,
      },
    });

    await prisma.notificationSetting.create({
      data: { userId: user.id },
    });

    const token = generateToken(user.id);

    return {
      token,
      user: this.formatUser(user),
    };
  }

  /**
   * Login
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    //Account status check
    if (user.accountStatus === AccountStatus.BANNED) {
      throw new AuthenticationError('Account is banned');
    }

    if (user.accountStatus === AccountStatus.DEACTIVATED) {
      throw new AuthenticationError('Account is deactivated');
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // ✅ update last active
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActiveAt: new Date(),
        status: UserStatus.ONLINE,
      },
    });

    const token = generateToken(user.id);

    return {
      token,
      user: this.formatUser(user),
    };
  }

  /**
   * Get profile
   */
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return this.formatUser(user);
  }

  /**
   * Update profile
   */
  async updateProfile(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.formatUser(user);
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const valid = await comparePassword(oldPass, user.passwordHash);

    if (!valid) {
      throw new AuthenticationError('Invalid current password');
    }

    const passwordHash = await hashPassword(newPass);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  /**
   * Refresh token
   */
  async refreshToken(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return {
      token: generateToken(user.id),
      user: this.formatUser(user),
    };
  }

  /**
   * Reusable formatter
   */
  private formatUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      accountStatus: user.accountStatus,
    };
  }
}

export default new AuthService();

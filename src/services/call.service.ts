import prisma from '../config/database.js';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.js';
import { CallParticipantStatus, CallStatus } from '@prisma/client';

export class CallService {
  /**
   * Initiate call
   */
  async initiateCall(
    initiatorId: string,
    data: { type: 'AUDIO' | 'VIDEO' | 'SCREEN_SHARE'; channelId?: string },
  ) {
    if (!data.channelId) {
      throw new AuthenticationError('Channel required');
    }

    const channel = await prisma.channel.findUnique({
      where: { id: data.channelId },
    });

    if (!channel) {
      throw new NotFoundError('Channel');
    }

    // prevent multiple active calls
    const existingCall = await prisma.call.findFirst({
      where: {
        channelId: data.channelId,
        status: {
          in: [CallStatus.INITIATED, CallStatus.ACTIVE],
        },
      },
    });

    if (existingCall) {
      throw new ConflictError('Call already active in this channel');
    }

    return prisma.call.create({
      data: {
        initiatorId,
        type: data.type,
        channelId: data.channelId,
        status: CallStatus.INITIATED,
        startedAt: new Date(),
      },
      include: {
        participants: true,
      },
    });
  }

  /**
   * Get call
   */
  async getCallStatus(callId: string) {
    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: { participants: true },
    });

    if (!call) {
      throw new NotFoundError('Call');
    }

    return call;
  }

  /**
   * Accept call
   */
  async acceptCall(callId: string, userId: string) {
    const call = await this.getCallStatus(callId);

    if (call.status === CallStatus.ENDED) {
      throw new ConflictError('Call already ended');
    }

    await prisma.callParticipant.upsert({
      where: {
        callId_userId: { callId, userId },
      },
      update: { status: CallParticipantStatus.JOINED },
      create: {
        callId,
        userId,
        status: CallParticipantStatus.JOINED,
      },
    });

    return prisma.call.update({
      where: { id: callId },
      data: { status: CallStatus.ACTIVE },
      include: { participants: true },
    });
  }

  /**
   * Decline call
   */
  async declineCall(callId: string, userId: string) {
    await this.getCallStatus(callId);

    await prisma.callParticipant.upsert({
      where: {
        callId_userId: { callId, userId },
      },
      update: { status: CallParticipantStatus.DECLINED },
      create: {
        callId,
        userId,
        status: CallParticipantStatus.DECLINED,
      },
    });

    // OPTIONAL: if everyone declined → end call
    return { message: 'Call declined' };
  }

  /**
   * End call
   */
  async endCall(callId: string, userId: string) {
    const call = await this.getCallStatus(callId);

    const isParticipant =
      call.initiatorId === userId ||
      call.participants.some((p) => p.userId === userId);

    if (!isParticipant) {
      throw new AuthenticationError('Not part of call');
    }

    return prisma.call.update({
      where: { id: callId },
      data: {
        status: CallStatus.ENDED,
        endedAt: new Date(),
      },
    });
  }

  /**
   * Call history
   */
  async getCallHistory(
    userId: string,
    options: { page: number; limit: number },
  ) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [calls, total] = await Promise.all([
      prisma.call.findMany({
        where: {
          OR: [
            { initiatorId: userId },
            { participants: { some: { userId } } },
          ],
        },
        include: { participants: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.call.count({
        where: {
          OR: [
            { initiatorId: userId },
            { participants: { some: { userId } } },
          ],
        },
      }),
    ]);

    return {
      calls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Add participant
   */
  async addParticipant(callId: string, userId: string) {
    return prisma.callParticipant.upsert({
      where: {
        callId_userId: { callId, userId },
      },
      update: { status: CallParticipantStatus.JOINED },
      create: {
        callId,
        userId,
        status: CallParticipantStatus.JOINED,
      },
    });
  }

  /**
   * Remove participant
   */
  async removeParticipant(callId: string, userId: string) {
    await prisma.callParticipant.deleteMany({
      where: { callId, userId },
    });

    return { message: 'Participant removed' };
  }

  /**
   * Active calls
   */
  async getActiveCalls(userId: string) {
    return prisma.call.findMany({
      where: {
        status: CallStatus.ACTIVE,
        OR: [
          { initiatorId: userId },
          { participants: { some: { userId } } },
        ],
      },
      include: { participants: true },
    });
  }

  /**
   * Leave call
   */
  async leaveCall(callId: string, userId: string) {
    return prisma.callParticipant.update({
      where: {
        callId_userId: { callId, userId },
      },
      data: { status: CallParticipantStatus.LEFT },
    });
  }

  /**
   * Active call in channel
   */
  async getActiveCallInChannel(channelId: string) {
    return prisma.call.findFirst({
      where: {
        channelId,
        status: {
          in: [CallStatus.INITIATED, CallStatus.ACTIVE],
        },
      },
      include: { participants: true },
    });
  }
}

export default new CallService();

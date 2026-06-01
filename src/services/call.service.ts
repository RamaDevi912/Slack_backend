import prisma from '../config/database.js';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.js';
import { CallParticipantStatus, CallStatus } from '@prisma/client';

// ── Interfaces ──

export interface InitiateCallInput {
  type: 'AUDIO' | 'VIDEO' | 'SCREEN_SHARE';
  channelId?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// ── Service Functions ──

export const initiateCall = async (initiatorId: string, data: InitiateCallInput) => {
  if (!data.channelId) {
    throw new AuthenticationError('Channel required');
  }

  const channel = await prisma.channel.findUnique({
    where: { id: data.channelId },
  });

  if (!channel) {
    throw new NotFoundError('Channel');
  }

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
};

export const getCallStatus = async (callId: string) => {
  const call = await prisma.call.findUnique({
    where: { id: callId },
    include: { participants: true },
  });

  if (!call) {
    throw new NotFoundError('Call');
  }

  return call;
};

export const acceptCall = async (callId: string, userId: string) => {
  const call = await getCallStatus(callId);

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
};

export const declineCall = async (callId: string, userId: string) => {
  await getCallStatus(callId);

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

  return { message: 'Call declined' };
};

export const endCall = async (callId: string, userId: string) => {
  const call = await getCallStatus(callId);

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
};

export const getCallHistory = async (userId: string, options: PaginationOptions) => {
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
};

export const addParticipant = async (callId: string, userId: string) => {
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
};

export const removeParticipant = async (callId: string, userId: string) => {
  await prisma.callParticipant.deleteMany({
    where: { callId, userId },
  });

  return { message: 'Participant removed' };
};

export const getActiveCalls = async (userId: string) => {
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
};

export const leaveCall = async (callId: string, userId: string) => {
  return prisma.callParticipant.update({
    where: {
      callId_userId: { callId, userId },
    },
    data: { status: CallParticipantStatus.LEFT },
  });
};

export const getActiveCallInChannel = async (channelId: string) => {
  return prisma.call.findFirst({
    where: {
      channelId,
      status: {
        in: [CallStatus.INITIATED, CallStatus.ACTIVE],
      },
    },
    include: { participants: true },
  });
};


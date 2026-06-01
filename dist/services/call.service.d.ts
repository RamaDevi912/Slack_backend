export declare class CallService {
    /**
     * Initiate call
     */
    initiateCall(initiatorId: string, data: {
        type: 'AUDIO' | 'VIDEO' | 'SCREEN_SHARE';
        channelId?: string;
    }): Promise<{
        participants: {
            id: string;
            status: import(".prisma/client").$Enums.CallParticipantStatus;
            userId: string;
            joinedAt: Date;
            callId: string;
            leftAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.CallStatus;
        createdAt: Date;
        workspaceId: string | null;
        initiatorId: string;
        type: import(".prisma/client").$Enums.CallType;
        channelId: string | null;
        directMessageRoomId: string | null;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
    }>;
    /**
     * Get call
     */
    getCallStatus(callId: string): Promise<{
        participants: {
            id: string;
            status: import(".prisma/client").$Enums.CallParticipantStatus;
            userId: string;
            joinedAt: Date;
            callId: string;
            leftAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.CallStatus;
        createdAt: Date;
        workspaceId: string | null;
        initiatorId: string;
        type: import(".prisma/client").$Enums.CallType;
        channelId: string | null;
        directMessageRoomId: string | null;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
    }>;
    /**
     * Accept call
     */
    acceptCall(callId: string, userId: string): Promise<{
        participants: {
            id: string;
            status: import(".prisma/client").$Enums.CallParticipantStatus;
            userId: string;
            joinedAt: Date;
            callId: string;
            leftAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.CallStatus;
        createdAt: Date;
        workspaceId: string | null;
        initiatorId: string;
        type: import(".prisma/client").$Enums.CallType;
        channelId: string | null;
        directMessageRoomId: string | null;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
    }>;
    /**
     * Decline call
     */
    declineCall(callId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * End call
     */
    endCall(callId: string, userId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CallStatus;
        createdAt: Date;
        workspaceId: string | null;
        initiatorId: string;
        type: import(".prisma/client").$Enums.CallType;
        channelId: string | null;
        directMessageRoomId: string | null;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
    }>;
    /**
     * Call history
     */
    getCallHistory(userId: string, options: {
        page: number;
        limit: number;
    }): Promise<{
        calls: ({
            participants: {
                id: string;
                status: import(".prisma/client").$Enums.CallParticipantStatus;
                userId: string;
                joinedAt: Date;
                callId: string;
                leftAt: Date | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.CallStatus;
            createdAt: Date;
            workspaceId: string | null;
            initiatorId: string;
            type: import(".prisma/client").$Enums.CallType;
            channelId: string | null;
            directMessageRoomId: string | null;
            startedAt: Date | null;
            endedAt: Date | null;
            duration: number | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    /**
     * Add participant
     */
    addParticipant(callId: string, userId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CallParticipantStatus;
        userId: string;
        joinedAt: Date;
        callId: string;
        leftAt: Date | null;
    }>;
    /**
     * Remove participant
     */
    removeParticipant(callId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Active calls
     */
    getActiveCalls(userId: string): Promise<({
        participants: {
            id: string;
            status: import(".prisma/client").$Enums.CallParticipantStatus;
            userId: string;
            joinedAt: Date;
            callId: string;
            leftAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.CallStatus;
        createdAt: Date;
        workspaceId: string | null;
        initiatorId: string;
        type: import(".prisma/client").$Enums.CallType;
        channelId: string | null;
        directMessageRoomId: string | null;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
    })[]>;
    /**
     * Leave call
     */
    leaveCall(callId: string, userId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CallParticipantStatus;
        userId: string;
        joinedAt: Date;
        callId: string;
        leftAt: Date | null;
    }>;
    /**
     * Active call in channel
     */
    getActiveCallInChannel(channelId: string): Promise<({
        participants: {
            id: string;
            status: import(".prisma/client").$Enums.CallParticipantStatus;
            userId: string;
            joinedAt: Date;
            callId: string;
            leftAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.CallStatus;
        createdAt: Date;
        workspaceId: string | null;
        initiatorId: string;
        type: import(".prisma/client").$Enums.CallType;
        channelId: string | null;
        directMessageRoomId: string | null;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
    }) | null>;
}
declare const _default: CallService;
export default _default;
//# sourceMappingURL=call.service.d.ts.map
import { forwardRef, Inject } from '@nestjs/common';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatUsecase } from '../../application/usecases/chat/implementation/message.usecase';
import { MessageDto } from '../../application/dtos/message.dto';

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

interface AuthenticatedSocket extends Socket {
  userId: string;
}

interface Group {
  id: string;
  name?: string;
}

interface ChatMessage {
  id?: string;
  content: string;
  senderId: string;
  conversationId?: string;
  groupId?: string;
  createdAt?: Date;
}

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
  path: '/ws',
})
// @UseGuards(AccessTokenGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => 'IChatUsecase'))
    private readonly _chatUsecase: ChatUsecase,
  ) {}
  afterInit(server: Server) {
    server.use((socket: Socket, next) => {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token = cookies['accessToken'];

      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_ACCESS_SECRET!,
        ) as JwtPayload;
        const userId = decoded.sub;

        if (!userId) {
          return next(new Error('Invalid token: no sub'));
        }

        (socket as AuthenticatedSocket).userId = userId;
        void socket.join(userId);
        next(); // success
      } catch (err) {
        return next(new Error('Authentication error'));
      }
    });
  }
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    data: { conversationId?: string; groupId?: string; isTyping: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const roomId = data.conversationId || data.groupId;
    if (!roomId) return;

    client.to(roomId).emit('userTyping', {
      userId: client.userId,
      isTyping: data.isTyping,
    });
  }
  @SubscribeMessage('getStatus')
  async handleGetStatus(
    @MessageBody() targetUserId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const isOnline = this.server.sockets.adapter.rooms.has(targetUserId);
    const lastSeen = await this._chatUsecase.getLastSeen(targetUserId);
    client.emit('userStatus', {
      userId: targetUserId,
      isOnline,
      lastSeen: lastSeen ? lastSeen.toISOString() : null,
    });
  }
  async handleConnection(client: Socket) {
    const userId = (client as unknown as AuthenticatedSocket).userId;
    if (!userId) {
      client.disconnect(true);
      return;
    }
    void client.join(userId);
    client.broadcast.emit('userOnline', { userId });
    try {
      const groups = await this._chatUsecase.getUserGroups(userId);
      groups.forEach((group: Group) => {
        void client.join(group.id);
      });
      void client.join(userId);
    } catch (err) {
      console.error('Failed to fetch groups on connect:', err);
    }
    client.on('disconnect', () => {
      this.server.emit('userOffline', {
        userId,
        lastSeen: new Date().toISOString(),
      });
      void this._chatUsecase
        .updateLastSeen(userId, new Date())
        .catch(console.error);
    });
  }

  handleDisconnect(client: Socket) {}

  notifyConnectionRequest(
    receiverId: string,
    payload: {
      connectionId: string;
      senderId: string;
      senderName: string;
      senderProfileImage: string;
    },
  ) {
    this.server.to(receiverId).emit('connectionRequest', payload);
  }

  notifyConnectionAccepted(
    senderId: string,
    payload: { accepterId: string; accepterName: string },
  ) {
    this.server.to(senderId).emit('connectionAccepted', payload);
  }

  broadcastMessageToChat(
    conversationId: string,
    message: ChatMessage,
    receiverId?: string,
  ) {
    this.server.to(conversationId).emit('newMessage', message);
    if (receiverId) {
      this.server.to(receiverId).emit('newMessageNotification', {
        conversationId,
        messagePreview: message.content,
        from: message.senderId,
      });
    }
  }
  @SubscribeMessage('joinRoom')
  handleJoin(
    @MessageBody() payload: { conversationId?: string; groupId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    // const { conversationId } = payload;
    const roomId = payload.conversationId || payload.groupId;
    if (!roomId) {
      console.warn(
        `[GATEWAY] Tried to join undefined room from socket ${client.id}`,
      );
      return;
    }
    if (!client.rooms.has(roomId)) {
      void client.join(roomId);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeave(
    @MessageBody() payload: { conversationId?: string; groupId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = payload.conversationId || payload.groupId;
    if (roomId) {
      void client.leave(roomId);
    }
    // client.emit('left', { conversationId: payload.conversationId });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { conversationId?: string; groupId?: string; content: string },
  ) {
    const senderId = (client as unknown as AuthenticatedSocket).userId;
    if (!data.content?.trim()) return;
    // Save message
    let savedMessage: MessageDto;
    if (data.groupId) {
      savedMessage = await this._chatUsecase.saveGroupMessage(
        data.groupId,
        senderId,
        data.content,
      );
      this.server.to(data.groupId).emit('receiveMessage', savedMessage);
    } else if (data.conversationId) {
      const saved = await this._chatUsecase.saveMessages(
        data.conversationId,
        senderId,
        data.content,
      );

      const messageWithStatus = { ...saved, status: 'sent' };
      this.server
        .to(data.conversationId)
        .emit('receiveMessage', messageWithStatus);
    }
  }

  @SubscribeMessage('markRead')
  handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { conversationId?: string; groupId?: string; messageIds: string[] },
  ) {
    const roomId = data.conversationId || data.groupId;
    if (!roomId) return;

    // await this._chatUsecase.markMessagesAsRead(data.messageIds);

    // Broadcast to the room (so the sender sees blue ticks)
    client.to(roomId).emit('messagesRead', {
      conversationId: data.conversationId,
      groupId: data.groupId,
      messageIds: data.messageIds,
      readerId: (client as unknown as AuthenticatedSocket).userId,
    });
  }
  @SubscribeMessage('startCall')
  handleStartCall(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      toUserId: string;
      conversationId: string;
      callType: 'video' | 'audio';
      signalData: unknown;
    },
  ) {
    const fromUserId = (client as AuthenticatedSocket).userId;

    this.server.to(data.toUserId).emit('incomingCall', {
      from: fromUserId,
      conversationId: data.conversationId,
      callType: data.callType,
      signalData: data.signalData,
    });
  }
  @SubscribeMessage('acceptCall')
  handleAcceptCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callerId: string; signal: unknown },
  ) {
    this.server.to(data.callerId).emit('callAccepted', { signal: data.signal });
  }
  @SubscribeMessage('rejectCall')
  handleRejectCall(@MessageBody() data: { callerId: string }) {
    this.server.to(data.callerId).emit('callRejected');
  }

  @SubscribeMessage('endCall')
  handleEndCall(@MessageBody() data: { toUserId: string }) {
    this.server.to(data.toUserId).emit('callEnded');
  }
}

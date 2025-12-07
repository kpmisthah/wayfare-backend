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
import { ChatUsecase } from 'src/application/usecases/chat/implementation/message.usecase';
import { MessageDto } from 'src/application/dtos/message.dto';

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

interface AuthenticatedSocket extends Socket {
  userId: string;
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
        console.log('No token → disconnecting');
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
        socket.join(userId);
        console.log(`Authenticated socket ${socket.id} → user ${userId}`);
        next(); // success
      } catch (err) {
        console.log('JWT verification failed:', err);
        return next(new Error('Authentication error'));
      }
    });
  }

  async handleConnection(client: Socket) {
    const userId = (client as any).userId;
    if (!userId) {
      console.log(`Unauthorized socket ${client.id} → disconnecting`);
      client.disconnect(true);
      return;
    }
    client.join(userId);
    console.log(`User ${userId} connected with socket ${client.id}`);
    try {
      const groups = await this._chatUsecase.getUserGroups(userId);
      console.log(
        groups,
        'ee grp s l entha vera noikknmonmofffdsdfsdfsd---0123024===================',
      );
      groups.forEach((group: any) => {
        client.join(group.id);
        console.log(`[AUTO-JOIN] ${userId} → group ${group.id}`);
      });
      client.join(userId);
    } catch (err) {
      console.error('Failed to fetch groups on connect:', err);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Socket disconnected:', client.id);
  }

  notifyConnectionRequest(
    receiverId: string,
    payload: { senderId: string; senderName: string },
  ) {
    this.server.to(receiverId).emit('connectionRequest', payload);
  }

  notifyConnectionAccepted(senderId: string, payload: { accepterId: string; accepterName: string }) {
    this.server.to(senderId).emit('connectionAccepted', payload);
  }
  
  broadcastMessageToChat(
    conversationId: string,
    message: any,
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
      client.join(roomId);
      console.log(`[JOIN] Client ${client.id} → room: ${roomId}`);
      console.log('Rooms:', client.rooms); // <-- debug
      console.log(
        'Clients in room:',
        this.server.sockets.adapter.rooms.get(roomId)?.size,
      );
    }
    // if(room){
    //   client.join(room)
    //   console.log(`Client ${client.id} joined room: ${room}`);
    // }
    // client.emit('joined', { roomId });
  }

  @SubscribeMessage('leaveRoom')
  handleLeave(
    @MessageBody() payload: { conversationId?: string; groupId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = payload.conversationId || payload.groupId;
    if (roomId) {
      client.leave(roomId);
    }
    // client.emit('left', { conversationId: payload.conversationId });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { conversationId?: string; groupId?: string; content: string },
  ) {
    console.log(
      'e]&=============================================================>',
    );
    console.log(
      `[GATEWAY] Message received: "${data.content}" from socket ${client.id}`,
    );
    const senderId = (client as any).userId;
    console.log(senderId, 'sernderIdddd');
    console.log(`[GATEWAY] Message from ${senderId}:`, data.content);
    console.log(`         → conversationId: ${data.conversationId || 'null'}`);
    console.log(`         → groupId: ${data.groupId || 'null'}`);
    if (!data.content?.trim()) return;
    // Save message
    let savedMessage: MessageDto;
    if (data.groupId) {
      savedMessage = await this._chatUsecase.saveGroupMessage(
        data.groupId,
        senderId,
        data.content,
      );
      console.log(savedMessage, '==============>saved message<============');
      this.server.to(data.groupId).emit('receiveMessage', savedMessage);
    } else if (data.conversationId) {
      const saved = await this._chatUsecase.saveMessages(
        data.conversationId,
        senderId,
        data.content,
      );
      console.log(
        saved,
        '==========================in chat gateway===========================',
      );
      // Broadcast to all sockets in that conversation room
      // this.server.to(data.conversationId).emit('receiveMessage', saved);
      this.server.to(data.conversationId).emit('receiveMessage', saved);
      console.log('emit event sender');
      // client.to(data.conversationId).emit('receiveMessage', saved);
    }
  }
  @SubscribeMessage('startCall')
  handleStartCall(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      toUserId: string;
      conversationId: string;
      callType: 'video' | 'audio';
      signalData: any;
    },
  ) {
    const fromUserId = (client as any).userId;
    console.log(
      `----------<><><>${fromUserId} is calling ${data.toUserId} (${data.callType})----------------->`,
    );
    console.log(data, 'data in handlerStartCalll');

    // Send call to the receiver
    this.server.to(data.toUserId).emit('incomingCall', {
      from: fromUserId,
      // fromName: 'User', // You can pass name later
      conversationId: data.conversationId,
      callType: data.callType,
      signalData: data.signalData, // WebRTC signal
    });
  }
  @SubscribeMessage('acceptCall')
  handleAcceptCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callerId: string; signal: any },
  ) {
    console.log(`Call accepted by ${(client as any).userId}`);
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

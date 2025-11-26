import { Inject, Req, UseGuards } from '@nestjs/common';
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
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { ChatUsecase } from 'src/application/usecases/chat/implementation/message.usecase';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
  path: '/ws',
})
// @UseGuards(AccessTokenGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject('IChatUsecase')
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
        ) as any;
        const userId = decoded.sub;

        if (!userId) {
          return next(new Error('Invalid token: no sub'));
        }

        (socket as any).userId = userId;
        socket.join(userId);
        console.log(`Authenticated socket ${socket.id} → user ${userId}`);
        next(); // success
      } catch (err) {
        console.log('JWT verification failed:', err);
        return next(new Error('Authentication error'));
      }
    });
  }

  handleConnection(client: Socket) {
    // console.log('Socket connected:', client.id);

    // const cookies = cookie.parse(client.handshake.headers.cookie || '');
    // const token = cookies['accessToken'];
    // console.log('token in handleConnection', token);
    // console.log(
    //   `[GATEWAY] handleConnection -> socket.id: ${client.id}, userId: ${(client as any).userId}`,
    // );

    // if (!token) {
    //   console.log('No access token found in cookies');
    //   client.disconnect();
    //   return;
    // }

    // try {
    //   const decoded = jwt.verify(
    //     token,
    //     process.env.JWT_ACCESS_SECRET!,
    //   ) as jwt.JwtPayload;

    //   console.log('Connected user:', decoded);

    //   const userId = decoded.sub as string; // ✅ cast sub to string safely
    //   if (!userId) {
    //     console.log('No userId (sub) found in decoded token');
    //     client.disconnect();
    //     return;
    //   }

    //   (client as any).userId = userId;
    //   client.join(userId); // ✅ Now userId is defined
    //   console.log(` User ${userId} joined their personal room`);
    // } catch (err) {
    //   console.log(' Invalid token', err);
    //   client.disconnect();
    // }
    const userId = (client as any).userId;
    if (!userId) {
      console.log(`Unauthorized socket ${client.id} → disconnecting`);
      client.disconnect(true);
      return;
    }

    console.log(`User ${userId} connected with socket ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket disconnected:', client.id);
  }

  notifyConnectionAccepted(
    senderId: string,
    payload: { conversationId: string; accepterName: string },
  ) {
    this.server.to(senderId).emit('connectionAcceptedNotification', payload);
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
    @MessageBody() payload: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = payload;
    if (!conversationId) {
      console.warn(
        `[GATEWAY] Tried to join undefined room from socket ${client.id}`,
      );
      return;
    }
    if (!client.rooms.has(conversationId)) {
      client.join(conversationId);
      console.log(`Client ${client.id} joined room: ${conversationId}`);
      console.log('Rooms:', client.rooms); // <-- debug
      console.log(
        'Clients in room:',
        this.server.sockets.adapter.rooms.get(conversationId)?.size,
      );
    }

    client.emit('joined', { conversationId });
  }

  @SubscribeMessage('leaveRoom')
  handleLeave(
    @MessageBody() payload: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(payload.conversationId);
    client.emit('left', { conversationId: payload.conversationId });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    console.log(
      'e]&=============================================================>',
    );
    console.log(
      `[GATEWAY] Message received: "${data.content}" from socket ${client.id}`,
    );
    const senderId = (client as any).userId;
    console.log(senderId, 'sernderIdddd');
    if (!data.content?.trim()) return;
    // Save message
    let saved = await this._chatUsecase.saveMessages(
      data.conversationId,
      senderId,
      data.content,
    );
    console.log(saved, 'in chat gateway');
    // Broadcast to all sockets in that conversation room
    // this.server.to(data.conversationId).emit('receiveMessage', saved);
    this.server.to(data.conversationId).emit('receiveMessage', saved);
    console.log('emit event sender');
    // client.to(data.conversationId).emit('receiveMessage', saved);
  }
}


import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MessageEntity } from 'src/domain/entities/message.entity';
import { IChatRepository } from 'src/domain/repositories/chat/chat.repository.interface';
import { IChatUsecase } from '../interfaces/message.interface';
import { MessageMapper } from '../../mapper/message.mapper';
import { MessageDto } from 'src/application/dtos/message.dto';
import { GroupChatDto } from 'src/application/dtos/group-chat.dto';
import { Server } from 'socket.io';
import { ChatGateway } from 'src/presentation/chat/chat.gateway';

@Injectable()
export class ChatUsecase implements IChatUsecase {
  constructor(
    @Inject('IMessageRepository')
    private readonly _chatRepo: IChatRepository,
    @Inject(forwardRef(() => ChatGateway))
    private readonly _chatGateway: ChatGateway,
  ) {}
  async saveMessages(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<MessageDto | null> {
    const messageEntity = MessageEntity.create({
      conversationId,
      senderId,
      content,
    });
    console.log(conversationId, 'in message app');
    console.log(senderId, 'sender id in message app');
    console.log(content, 'in content in app');
    let chat = await this._chatRepo.createChat(messageEntity);
    console.log(chat, 'chattter in app');
    if (!chat) return null;
    return MessageMapper.toMessageDto(chat);
  }
  async getMessages(conversationId: string): Promise<MessageDto[]> {
    let messages =
      await this._chatRepo.getMessagesByConversation(conversationId);
    return MessageMapper.toMessageDtos(messages);
  }

  async createGroup(creatorId: string, dto: GroupChatDto) {
    const uniqueMemberIds = [
      ...new Set(dto.memberIds.filter((id) => id !== creatorId)),
    ];
    const allMembers = [creatorId, ...uniqueMemberIds];

    const group = await this._chatRepo.createGroup({
      name: dto.name,
      avatar: dto.avatar,
      creatorId,
      members: allMembers.map((userId) => ({
        userId,
        role: userId === creatorId ? 'ADMIN' : 'MEMBER',
      })),
    })

    const groupId = group.id

    // FORCE ALL MEMBERS INTO THE ROOM — NO RACE CONDITION
    allMembers.forEach((userId) => {
      const userRoom =
        this._chatGateway.server.sockets.adapter.rooms.get(userId);
      if (userRoom) {
        userRoom.forEach((socketId) => {
          const socket = this._chatGateway.server.sockets.sockets.get(socketId);
          socket?.join(groupId);
          console.log(`[SERVER] Auto-joined ${userId} → group ${groupId}`);
        });
      }
    });
    const payload = {
      groupId: group.id,
      name: group.name,
      avatar: group.avatar || null,
      type: 'group',
      creatorId: group.creatorId,
      members: group.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        profileImage: m.user.profileImage || '',
        role: m.role,
      })),
      createdAt: group.createdAt,
    };

    // NOW 100% SAFE TO EMIT
    setImmediate(() => {
      this._chatGateway.server.to(groupId).emit('groupCreated', payload);
    });
    return {
      groupId: group.id,
      name: group.name,
      avatar: group.avatar,
      creatorId: group.creatorId,
      members: group.members.map((m) => ({
        userId: m.user.id || m.user.userId,
        name: m.user.name,
        profileImage: m.user.profileImage,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
      type: 'group',
      createdAt: group.createdAt,
    };
  }

  async saveGroupMessage(
    groupId: string,
    senderId: string,
    content: string,
  ): Promise<MessageDto> {
    // Optional: verify sender is member of group
    const isMember = await this._chatRepo.isUserInGroup(senderId, groupId);
    if (!isMember)
      throw new Error('Not authorized to send message in this group');

    const messageEntity = MessageEntity.createGroupMessage({
      groupId,
      senderId,
      content,
    });

    const chat = await this._chatRepo.createChat(messageEntity);
    return MessageMapper.toMessageDto(chat);
  }
  async getUserGroups(userId: string) {
    return this._chatRepo.getUserGroups(userId);
  }
  async isGroupId(id: string): Promise<boolean> {
  const group = await this._chatRepo.getGroupById(id)
  console.log(group,'=====group in isGroupIdd===========')
  return !!group;
}
async getGroupMessages(groupId: string): Promise<MessageDto[]> {
  const messages = await this._chatRepo.getMessagesByGroup(groupId);
  return MessageMapper.toMessageDtos(messages);
}
}

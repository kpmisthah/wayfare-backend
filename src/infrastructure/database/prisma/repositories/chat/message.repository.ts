import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { MessageEntity } from '../../../../../domain/entities/message.entity';
import { IChatRepository } from '../../../../../domain/repositories/chat/chat.repository.interface';
import { MessageMapper } from '../../../../mappers/message.mapper';

@Injectable()
export class MessageRepository
  extends BaseRepository<MessageEntity>
  implements IChatRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.message, MessageMapper);
  }
  async getMessagesByConversation(
    conversationId: string,
  ): Promise<MessageEntity[]> {
    const msgs = await this._prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return MessageMapper.toDomains(msgs);
  }
  async createChat(message: MessageEntity): Promise<MessageEntity> {
    console.log(message, 'messageeeee');
    const msg = await this._prisma.message.create({
      data: MessageMapper.toPrisma(message),
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true },
        },
      },
    });
    console.log(msg, 'msgggg');
    return MessageMapper.toDomain(msg);
  }
  // src/infrastructure/repositories/message.repository.ts (or create GroupRepository)

  async createGroup(data: {
    name: string;
    avatar?: string;
    creatorId: string;
    members: { userId: string; role: 'ADMIN' | 'MEMBER' }[];
  }) {
    return await this._prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: data.name,
          avatar: data.avatar,
          creatorId: data.creatorId,
          members: {
            create: data.members.map((m) => ({
              userId: m.userId,
              role: m.role,
            })),
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, profileImage: true },
              },
            },
          },
        },
      });

      return group;
    });
  }
  async isUserInGroup(userId: string, groupId: string): Promise<boolean> {
    const member = await this._prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    return !!member;
  }
  async getUserGroups(userId: string) {
    const groups = await this._prisma.group.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, profileImage: true } },
          },
        },
        creator: { select: { name: true } },
        _count: { select: { members: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return groups.map((g) => ({
      ...g,
      type: 'group',
    }));
  }
  async getGroupById(groupId: string) {
    return await this._prisma.group.findFirst({
      where: { id: groupId },
    });
  }
  async getMessagesByGroup(groupId: string): Promise<MessageEntity[]> {
    const msgs = await this._prisma.message.findMany({
      where: { groupId },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return MessageMapper.toDomains(msgs);
  }
  async incrementUnreadCount(conversationId: string, userId: string) {
    await this._prisma.userOnConversation.update({
      where: { userId_conversationId: { userId, conversationId } },
      data: { unreadCount: { increment: 1 } },
    });
  }

  async incrementUnreadCountForGroup(groupId: string, userId: string) {
    await this._prisma.groupMember.update({
      where: {
        groupId_userId: { groupId, userId },
      },
      data: {
        unreadCount: { increment: 1 },
      },
    });
  }

  async markChatAsRead(userId: string, chatId: string) {
    const isGroup = await this.getGroupById(chatId);
    if (isGroup) {
      await this._prisma.groupMember.update({
        where: { groupId_userId: { groupId: chatId, userId } },
        data: { unreadCount: 0 },
      });
    } else {
      await this._prisma.userOnConversation.update({
        where: { userId_conversationId: { userId, conversationId: chatId } },
        data: { unreadCount: 0 },
      });
    }
  }
  async getConversationParticipants(conversationId: string): Promise<string[]> {
    const participants = await this._prisma.userOnConversation.findMany({
      where: { conversationId },
      select: { userId: true },
    });
    return participants.map((p) => p.userId);
  }
  async getGroupMembers(groupId: string): Promise<string[]> {
    const members = await this._prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
    });
    return members.map((m) => m.userId);
  }

  async getLastMessageForConversation(conversationId: string) {
    const msg = await this._prisma.message.findFirst({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    });
    return msg ? MessageMapper.toDomain(msg) : null;
  }

  async getUnreadCountForConversation(conversationId: string, userId: string) {
    const uc = await this._prisma.userOnConversation.findUnique({
      where: { userId_conversationId: { userId, conversationId } },
      select: { unreadCount: true },
    });
    return uc?.unreadCount || 0;
  }

  async getLastMessageForGroup(groupId: string) {
    const msg = await this._prisma.message.findFirst({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
    });
    return msg ? MessageMapper.toDomain(msg) : null;
  }

  async getUnreadCountForGroup(groupId: string, userId: string) {
    const gm = await this._prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
      select: { unreadCount: true },
    });
    return gm?.unreadCount || 0;
  }

  async updateLastSeen(userId: string, date: Date) {
    await this._prisma.user.update({
      where: { id: userId },
      data: { lastSeen: date },
    });
  }

  async getLastSeen(userId: string) {
    const user = await this._prisma.user.findUnique({
      where: { id: userId },
      select: { lastSeen: true },
    });
    return user?.lastSeen || null;
  }
}

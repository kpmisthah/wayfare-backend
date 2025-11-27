import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { MessageEntity } from 'src/domain/entities/message.entity';
import { IChatRepository } from 'src/domain/repositories/chat/chat.repository.interface';
import { MessageMapper } from 'src/infrastructure/mappers/message.mapper';

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
      orderBy: { createdAt: 'asc' },
    });
    return MessageMapper.toDomains(msgs);
  }
  async createChat(message: MessageEntity): Promise<MessageEntity> {
    console.log(message, 'messageeeee');
    const msg = await this._prisma.message.create({
      data: MessageMapper.toPrisma(message),
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
    orderBy: { createdAt: 'asc' },
  });
  return MessageMapper.toDomains(msgs);
}
}

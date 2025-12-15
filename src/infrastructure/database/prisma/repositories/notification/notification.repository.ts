import { Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../../../../domain/repositories/user/notification.repository.interface';
import { NotificationEntity } from '../../../../../domain/entities/notification.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseRepository } from '../base.repository';
import { NotificationMapper } from '../../../../mappers/notification.mapper';

@Injectable()
export class NotificationRepository
  extends BaseRepository<NotificationEntity>
  implements INotificationRepository
{
  constructor(private readonly _prisma: PrismaService) {
    super(_prisma.notification, NotificationMapper);
  }
  async findByUser(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<NotificationEntity[]> {
    const res = await this._prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    return NotificationMapper.toDomainMany(res);
  }

  async markAsRead(notificationId: string): Promise<NotificationEntity | null> {
    const res = await this._prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return NotificationMapper.toDomain(res);
  }

  async countUnread(userId: string): Promise<number> {
    return this._prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}

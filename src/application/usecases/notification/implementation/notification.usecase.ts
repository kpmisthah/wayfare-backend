import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../../../domain/repositories/user/notification.repository.interface';
import { CreateNotificationDto } from '../../../dtos/create-notification.dto';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { INotifactionUsecase } from '../interfaces/notifcation.interface';
import { ChatGateway } from '../../../../presentation/chat/chat.gateway';
import { NotificationMapper } from '../../mapper/notification.mapper';

@Injectable()
export class NotificationUsecase implements INotifactionUsecase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepo: INotificationRepository,
    private readonly _chatGateway: ChatGateway,
  ) {}

  async createNotification(
    dto: CreateNotificationDto,
    userId: string,
  ): Promise<NotificationEntity | null> {
    console.log(dto, 'in createNotifacation');

    const entity = NotificationEntity.create({
      userId,
      title: dto.title,
      message: dto.message,
      type: dto.type,
    });

    console.log(entity, 'in create notifcationENtityty');

    const notification = await this._notificationRepo.create(entity);
    if (!notification) return null;
    const mappedNotification =
      NotificationMapper.toNotificationDto(notification);

    this._chatGateway.server.to(userId).emit('newNotification', {
      id: mappedNotification.id,
      title: mappedNotification.title,
      message: mappedNotification.message,
      unread: true,
      date: new Date().toISOString(),
      type: mappedNotification.type,
    });
    return notification;
  }

  async listNotification(userId: string, limit = 20, offset = 0) {
    const list = await this._notificationRepo.findByUser(userId, limit, offset);
    const mappedList = NotificationMapper.toNotificationsDto(list);
    const unreadCount = await this._notificationRepo.countUnread(userId);
    return { mappedList, unreadCount };
  }

  async markRead(notificationId: string) {
    return this._notificationRepo.markAsRead(notificationId);
  }
}

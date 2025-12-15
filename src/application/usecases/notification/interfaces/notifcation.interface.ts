import { CreateNotificationDto } from '../../../dtos/create-notification.dto';
import { ResponseNotificationDto } from '../../../dtos/response-notification.dto';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';

export interface INotifactionUsecase {
  createNotification(
    dto: CreateNotificationDto,
    userId: string,
  ): Promise<NotificationEntity | null>;
  listNotification(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<{ mappedList: ResponseNotificationDto[]; unreadCount: number }>;
  markRead(notificationId: string): Promise<NotificationEntity | null>;
}

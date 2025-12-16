import { CreateNotificationDto } from '../../../dtos/create-notification.dto';
import { ResponseNotificationDto } from '../../../dtos/response-notification.dto';

export interface INotifactionUsecase {
  createNotification(
    dto: CreateNotificationDto,
    userId: string,
  ): Promise<ResponseNotificationDto | null>;
  listNotification(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<{ mappedList: ResponseNotificationDto[]; unreadCount: number }>;
  markRead(notificationId: string): Promise<ResponseNotificationDto | null>;
}

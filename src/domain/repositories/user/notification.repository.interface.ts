import { NotificationEntity } from 'src/domain/entities/notification.entity';
import { IBaseRepository } from '../base.repository';

export interface INotificationRepository
  extends IBaseRepository<NotificationEntity> {
  findByUser(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<NotificationEntity[]>;
  markAsRead(notificationId: string): Promise<NotificationEntity | null>;
  countUnread(userId: string): Promise<number>;
}

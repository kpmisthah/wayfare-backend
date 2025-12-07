import { $Enums, Notification } from '@prisma/client';
import { NotificationEntity } from 'src/domain/entities/notification.entity';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';

export class NotificationMapper {
  static toDomain(notification: Notification): NotificationEntity {
    return new NotificationEntity(
      notification.id,
      notification.title,
      notification.message,
      notification.isRead,
      notification.userId,
      notification.types as NotificationStatus,
      notification.createdAt,
    );
  }

  static toPrisma(
    notification: NotificationEntity,
  ): Omit<Notification, 'id' | 'createdAt'> {
    return {
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      types:notification.notificationStatus as $Enums.NotificationStatus,
      userId: notification.userId,
    };
  }

  static toDomainMany(notifications: Notification[]): NotificationEntity[] {
    return notifications.map((n) => this.toDomain(n));
  }
}

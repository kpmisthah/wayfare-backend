import { ResponseNotificationDto } from '../../dtos/response-notification.dto';
import { NotificationEntity } from '../../../domain/entities/notification.entity';

export class NotificationMapper {
  static toNotificationDto(
    notifcationEntity: NotificationEntity,
  ): ResponseNotificationDto {
    return {
      id: notifcationEntity.id,
      title: notifcationEntity.title,
      message: notifcationEntity.message,
      unread: notifcationEntity.isRead,
      date: notifcationEntity.createdAt as unknown as string,
      type: notifcationEntity.notificationStatus,
    };
  }

  static toNotificationsDto(
    notficationEntity: NotificationEntity[],
  ): ResponseNotificationDto[] {
    return notficationEntity.map((notification) =>
      this.toNotificationDto(notification),
    );
  }
}

import { IsString } from 'class-validator';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';

export class ResponseNotificationDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  unread: boolean;

  date: string;

  type: NotificationStatus;
}

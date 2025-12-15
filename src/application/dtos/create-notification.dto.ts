import { IsString } from 'class-validator';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  type: NotificationStatus;
}

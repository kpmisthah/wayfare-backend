import { IsString } from 'class-validator';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  type: NotificationStatus;
}

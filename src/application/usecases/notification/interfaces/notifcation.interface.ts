import { CreateNotificationDto } from "src/application/dtos/create-notification.dto";
import { NotificationEntity } from "src/domain/entities/notification.entity";

export interface INotifactionUsecase{
    createNotification (dto: CreateNotificationDto,userId:string): Promise<NotificationEntity|null> 
    listNotification(userId:string,limit:number,offset:number)
    markRead(notificationId:string)
}
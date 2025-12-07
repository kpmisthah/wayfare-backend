import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateNotificationDto } from 'src/application/dtos/create-notification.dto';
import { RequestWithUser } from 'src/application/usecases/auth/interfaces/request-with-user';
import { INotifactionUsecase } from 'src/application/usecases/notification/interfaces/notifcation.interface';
import { AccessTokenGuard } from 'src/infrastructure/common/guard/accessToken.guard';

@Controller('notifications')
@UseGuards(AccessTokenGuard)
export class NotificationController {
  constructor(
    @Inject('INotificationUsecase')
    private readonly _notificationUsecase:INotifactionUsecase
  ) {}

  @Post()
  async create(@Req() req:RequestWithUser,@Body() body: CreateNotificationDto) {
    let userId = req.user['userId']
    return this._notificationUsecase.createNotification(body,userId);
    
  }

  @Get()
  async list(@Req() req:RequestWithUser,@Query('limit') limit?: string, @Query('offset') offset?: string) {

    let userId = req.user['userId']
    const l = limit ? parseInt(limit) : 1
    const o = offset ? parseInt(offset) : 0
    return this._notificationUsecase.listNotification(userId, l, o);
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    return this._notificationUsecase.markRead(id);
  }
}

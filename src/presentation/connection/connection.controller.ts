import {
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '../../application/usecases/auth/interfaces/request-with-user';
import { IAcceptConnection } from '../../application/usecases/connection/interfaces/accept-connection.interface';
import { IRejectConnection } from '../../application/usecases/connection/interfaces/reject-connection.interface';
import { ISendConnection } from '../../application/usecases/connection/interfaces/send-connection.interface';
import { AccessTokenGuard } from '../../infrastructure/common/guard/accessToken.guard';

@Controller('connections')
@UseGuards(AccessTokenGuard)
export class ConnectionController {
  constructor(
    @Inject('ISendConnectionUseCase')
    private readonly _sendConnection: ISendConnection,
    @Inject('IAcceptConnectionUseCase')
    private readonly _acceptConnection: IAcceptConnection,
    @Inject('IRejectConnectionUseCase')
    private readonly _rejectConnection: IRejectConnection,
  ) {}
  @Get()
  async getConnections(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return await this._sendConnection.getConnectionForUser(userId);
  }
  @Get('/accepted')
  async getAcceptedConnections(
    @Req() req: RequestWithUser,
  ): Promise<unknown[]> {
    const userId = req.user['userId'];
    console.log(userId, 'userIddddddd');
    const u = await this._sendConnection.getAcceptedConnections(userId);
    console.log(u, 'uu');
    return u as unknown[];
  }
  @Post(':receiverId')
  async send(
    @Req() req: RequestWithUser,
    @Param('receiverId') receiverId: string,
  ): Promise<{ message: string }> {
    console.log(receiverId, 'recieverIddd');
    const senderId = req.user['userId'];
    console.log(senderId, 'senderIddd');
    return await this._sendConnection.execute(senderId, receiverId);
  }
  @Patch(':id/accept')
  async accept(@Param('id') id: string): Promise<{ message: string }> {
    console.log(id, 'acceptance id in accept method');
    return await this._acceptConnection.execute(id);
  }
  @Patch(':id/reject')
  async reject(@Param('id') id: string): Promise<{ message: string }> {
    return await this._rejectConnection.execute(id);
  }
}

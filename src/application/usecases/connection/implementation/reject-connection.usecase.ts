import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IConnectionRepository } from 'src/domain/repositories/connection/connection.repository';
import { IRejectConnection } from '../interfaces/reject-connection.interface';

@Injectable()
export class RejectConnectionUseCase implements IRejectConnection {
  constructor(
    @Inject('IConnectionRepository')
    private readonly _ConnectionRepo: IConnectionRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const connection = await this._ConnectionRepo.findById(id);
    if (!connection) throw new NotFoundException('Connection not found');
    const updateConnection = connection.update({ status: 'REJECTED' });
    await this._ConnectionRepo.update(id, updateConnection);
    return { message: 'Connection rejected successfully' };
  }
}

import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IArgonService } from 'src/domain/interfaces/argon.service.interface';
//module kk import akekeela
@Injectable()
export class ArgonService implements IArgonService {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
  async comparePassword(hash: string, plain: string): Promise<boolean> {
    console.log(hash, 'hashed and plain', plain);

    return await argon2.verify(hash, plain);
  }
}

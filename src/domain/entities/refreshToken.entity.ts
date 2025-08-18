import * as argon2 from 'argon2';

export class RefreshToken {
  static async hash(token: string): Promise<string> {
    return await argon2.hash(token);
  }

  static async verify(hashed: string, plain: string): Promise<boolean> {
    return await argon2.verify(hashed, plain);
  }
}

import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken'; //

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    role: string;
    refreshToken?: string | null;
    iat?: number;
    exp?: number;
  };
}

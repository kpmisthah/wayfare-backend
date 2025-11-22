import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    role: string;
    refreshToken?: string | null;
    iat?: number;
    exp?: number;
  };
}

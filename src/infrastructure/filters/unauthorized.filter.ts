import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const isBlocked =
      typeof exceptionResponse === 'object' &&
      'code' in exceptionResponse &&
      ['USER_BLOCKED', 'AGENCY_PENDING'].includes(
        exceptionResponse.code as string,
      );

    if (isBlocked) {
      response.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      });
    }

    response.status(status).json(exceptionResponse);
  }
}

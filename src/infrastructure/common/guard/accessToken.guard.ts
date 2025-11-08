import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    console.log('Inside AccessTokenGuard canActivate');
    console.log('Request cookies:', req.cookies);
    console.log('Response headers (so far):', res.getHeaders());

    return super.canActivate(context);
  }
}

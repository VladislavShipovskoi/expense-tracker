import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = this.authService.getToken(request);
    if (!token) {
      throw new UnauthorizedException('Authorization error');
    }

    const validToken = this.authService.verifyToken(token);

    if (validToken.error) {
      throw new UnauthorizedException(validToken.error);
    }

    return true;
  }
}
